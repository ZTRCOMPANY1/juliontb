import os
import json
import time
import socket
import getpass
import platform
import subprocess
from datetime import datetime

import psutil
import requests


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_PATH = os.path.join(BASE_DIR, "config.json")


def load_config():
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


CONFIG = load_config()
SERVER_URL = CONFIG.get("server_url", "https://server-pcmonitor.onrender.com/api/agent/metrics")
TOKEN = CONFIG.get("token", "ztr280520")
INTERVAL_SECONDS = int(CONFIG.get("interval_seconds", 5))
WATCH_PROCESSES = CONFIG.get("watch_processes", [])
MONITOR_PORTS = CONFIG.get("monitor_ports", [])
MONITOR_SITES = CONFIG.get("monitor_sites", [])


previous_net = None
previous_disk = None
known_process_states = {}


def iso_now():
    return datetime.utcnow().isoformat() + "Z"


def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"


def get_public_ip():
    try:
        return requests.get("https://api.ipify.org?format=json", timeout=5).json()["ip"]
    except Exception:
        return None


def get_ping_ms():
    target = "8.8.8.8"
    try:
        if os.name == "nt":
            result = subprocess.run(["ping", "-n", "1", target], capture_output=True, text=True, timeout=8)
            output = result.stdout.lower()
            marker = "tempo="
            if marker in output:
                tail = output.split(marker, 1)[1]
                value = ""
                for char in tail:
                  if char.isdigit():
                    value += char
                  elif value:
                    break
                return float(value) if value else None
        else:
            result = subprocess.run(["ping", "-c", "1", target], capture_output=True, text=True, timeout=8)
            output = result.stdout.lower()
            marker = "time="
            if marker in output:
                tail = output.split(marker, 1)[1]
                value = ""
                for char in tail:
                    if char.isdigit() or char == ".":
                        value += char
                    elif value:
                        break
                return float(value) if value else None
    except Exception:
        return None
    return None


def get_packet_loss_percent():
    return 0.0


def get_cpu_temperature():
    try:
        temps = psutil.sensors_temperatures()
        if not temps:
            return None
        for _, entries in temps.items():
            for entry in entries:
                if getattr(entry, "current", None) is not None:
                    return round(float(entry.current), 1)
    except Exception:
        return None
    return None


def get_battery():
    try:
        battery = psutil.sensors_battery()
        if not battery:
            return {"percent": None, "plugged": None}
        return {
            "percent": battery.percent,
            "plugged": battery.power_plugged
        }
    except Exception:
        return {"percent": None, "plugged": None}


def get_gpu_data():
    return {
        "percent": None,
        "temperature_c": None,
        "fan_speed_rpm": None
    }


def get_cpu_data():
    return {
        "percent": psutil.cpu_percent(interval=1),
        "physical_cores": psutil.cpu_count(logical=False),
        "logical_cores": psutil.cpu_count(logical=True),
        "temperature_c": get_cpu_temperature()
    }


def get_memory_data():
    mem = psutil.virtual_memory()
    return {
        "percent": mem.percent,
        "total_bytes": mem.total,
        "used_bytes": mem.used,
        "available_bytes": mem.available
    }


def get_disk_data():
    global previous_disk

    target = "C:\\" if os.name == "nt" else "/"
    disk = psutil.disk_usage(target)
    io = psutil.disk_io_counters()

    read_bytes = io.read_bytes if io else None
    write_bytes = io.write_bytes if io else None

    if previous_disk:
        read_delta = max(0, read_bytes - previous_disk["read"]) if read_bytes is not None else None
        write_delta = max(0, write_bytes - previous_disk["write"]) if write_bytes is not None else None
    else:
        read_delta = None
        write_delta = None

    previous_disk = {
        "read": read_bytes or 0,
        "write": write_bytes or 0
    }

    return {
        "percent": disk.percent,
        "total_bytes": disk.total,
        "used_bytes": disk.used,
        "free_bytes": disk.free,
        "read_bytes": read_delta,
        "write_bytes": write_delta
    }


def get_partitions():
    items = []
    for part in psutil.disk_partitions(all=False):
        try:
            usage = psutil.disk_usage(part.mountpoint)
            items.append({
                "device": part.device,
                "mountpoint": part.mountpoint,
                "filesystem": part.fstype,
                "total_bytes": usage.total,
                "used_bytes": usage.used,
                "free_bytes": usage.free,
                "percent": usage.percent
            })
        except Exception:
            continue
    return items


def get_network_data():
    global previous_net
    io = psutil.net_io_counters()

    if previous_net:
        sent_delta = max(0, io.bytes_sent - previous_net["sent"])
        recv_delta = max(0, io.bytes_recv - previous_net["recv"])
    else:
        sent_delta = 0
        recv_delta = 0

    previous_net = {
        "sent": io.bytes_sent,
        "recv": io.bytes_recv
    }

    return {
        "bytes_sent": io.bytes_sent,
        "bytes_recv": io.bytes_recv,
        "upload_rate_bytes": sent_delta / max(INTERVAL_SECONDS, 1),
        "download_rate_bytes": recv_delta / max(INTERVAL_SECONDS, 1),
        "ping_ms": get_ping_ms(),
        "packet_loss_percent": get_packet_loss_percent()
    }


def get_system_data():
    boot_time = psutil.boot_time()
    return {
        "uptime_seconds": int(time.time() - boot_time),
        "boot_time": datetime.fromtimestamp(boot_time).isoformat()
    }


def get_machine_info():
    return {
        "machine_id": CONFIG.get("machine_id") or socket.gethostname().lower(),
        "name": CONFIG.get("machine_name") or socket.gethostname(),
        "hostname": socket.gethostname(),
        "username": getpass.getuser(),
        "os": platform.system(),
        "os_version": platform.version(),
        "architecture": platform.machine(),
        "local_ip": get_local_ip(),
        "public_ip": get_public_ip(),
        "agent_version": "2.0.0"
    }


def get_top_processes(limit=10):
    items = []
    for proc in psutil.process_iter(["pid", "name", "cpu_percent", "memory_percent", "status"]):
        try:
            info = proc.info
            items.append({
                "pid": info.get("pid"),
                "name": info.get("name"),
                "cpu_percent": info.get("cpu_percent") or 0,
                "memory_percent": round(info.get("memory_percent") or 0, 2),
                "status": info.get("status")
            })
        except Exception:
            continue

    items.sort(key=lambda x: (x["cpu_percent"], x["memory_percent"]), reverse=True)
    return items[:limit]


def get_monitor_ports():
    results = []
    for port in MONITOR_PORTS:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(1)
        status = False
        try:
            status = sock.connect_ex(("127.0.0.1", int(port))) == 0
        except Exception:
            status = False
        finally:
            sock.close()

        results.append({
            "port": port,
            "open": status
        })
    return results


def get_monitor_sites():
    results = []
    for url in MONITOR_SITES:
        try:
            started = time.time()
            response = requests.get(url, timeout=8)
            elapsed_ms = round((time.time() - started) * 1000, 1)
            results.append({
                "url": url,
                "online": response.ok,
                "status_code": response.status_code,
                "latency_ms": elapsed_ms
            })
        except Exception:
            results.append({
                "url": url,
                "online": False,
                "status_code": None,
                "latency_ms": None
            })
    return results


def get_watch_process_events():
    current = {name.lower(): False for name in WATCH_PROCESSES}

    for proc in psutil.process_iter(["name"]):
        try:
            name = (proc.info.get("name") or "").lower()
            if name in current:
                current[name] = True
        except Exception:
            continue

    events = []
    for process_name, is_open in current.items():
        old_state = known_process_states.get(process_name)
        if old_state is None:
            known_process_states[process_name] = is_open
            continue

        if old_state != is_open:
            events.append({
                "level": "info" if is_open else "warn",
                "event_type": "watched_process_change",
                "message": f"Processo {'abriu' if is_open else 'fechou'}: {process_name}"
            })
            known_process_states[process_name] = is_open

    return events


def build_payload():
    return {
        "collected_at": iso_now(),
        "machine": get_machine_info(),
        "system": get_system_data(),
        "cpu": get_cpu_data(),
        "gpu": get_gpu_data(),
        "memory": get_memory_data(),
        "disk": get_disk_data(),
        "battery": get_battery(),
        "network": get_network_data(),
        "partitions": get_partitions(),
        "top_processes": get_top_processes(),
        "ports": get_monitor_ports(),
        "sites": get_monitor_sites(),
        "events": get_watch_process_events()
    }


def send_payload(payload):
    headers = {
        "Authorization": f"Bearer {TOKEN}",
        "Content-Type": "application/json"
    }
    response = requests.post(SERVER_URL, json=payload, headers=headers, timeout=15)
    response.raise_for_status()


if __name__ == "__main__":
    print("Agente V2 iniciado.")
    print(f"Enviando para: {SERVER_URL}")

    while True:
        try:
            payload = build_payload()
            send_payload(payload)
            print(f"[{datetime.now().strftime('%H:%M:%S')}] Métricas enviadas com sucesso.")
        except Exception as error:
            print(f"Erro ao enviar métricas: {error}")

        time.sleep(INTERVAL_SECONDS)