import os
import time
import socket
import platform
import requests
import psutil
from datetime import datetime

SERVER_URL = os.getenv('SERVER_URL', 'https://server-juliontb.onrender.com/api/agent/metrics')
AGENT_TOKEN = os.getenv('AGENT_TOKEN', 'ztr-14121981')
INTERVAL_SECONDS = int(os.getenv('INTERVAL_SECONDS', '2'))


def get_local_ip():
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.connect(('8.8.8.8', 80))
        ip = sock.getsockname()[0]
        sock.close()
        return ip
    except Exception:
        return '127.0.0.1'


def get_cpu_data():
    return {
        'percent': psutil.cpu_percent(interval=1),
        'physical_cores': psutil.cpu_count(logical=False),
        'logical_cores': psutil.cpu_count(logical=True),
        'frequency_mhz': getattr(psutil.cpu_freq(), 'current', None)
    }


def get_memory_data():
    memory = psutil.virtual_memory()
    return {
        'percent': memory.percent,
        'total_bytes': memory.total,
        'used_bytes': memory.used,
        'available_bytes': memory.available
    }


def get_disk_data():
    disk = psutil.disk_usage('/') if os.name != 'nt' else psutil.disk_usage('C:\\')
    return {
        'percent': disk.percent,
        'total_bytes': disk.total,
        'used_bytes': disk.used,
        'free_bytes': disk.free
    }


def get_network_data():
    io = psutil.net_io_counters()
    return {
        'bytes_sent': io.bytes_sent,
        'bytes_recv': io.bytes_recv,
        'packets_sent': io.packets_sent,
        'packets_recv': io.packets_recv
    }


def get_system_data():
    boot_timestamp = psutil.boot_time()
    uptime_seconds = int(time.time() - boot_timestamp)

    return {
        'hostname': socket.gethostname(),
        'local_ip': get_local_ip(),
        'os': platform.system(),
        'os_version': platform.version(),
        'release': platform.release(),
        'architecture': platform.machine(),
        'boot_time': datetime.fromtimestamp(boot_timestamp).isoformat(),
        'uptime_seconds': uptime_seconds
    }


def build_payload():
    return {
        'collected_at': datetime.utcnow().isoformat() + 'Z',
        'cpu': get_cpu_data(),
        'memory': get_memory_data(),
        'disk': get_disk_data(),
        'network': get_network_data(),
        'system': get_system_data()
    }


def send_metrics(payload):
    headers = {
        'Authorization': f'Bearer {AGENT_TOKEN}',
        'Content-Type': 'application/json'
    }
    response = requests.post(SERVER_URL, json=payload, headers=headers, timeout=10)
    response.raise_for_status()


if __name__ == '__main__':
    print('Agente de monitoramento iniciado.')
    print(f'Enviando para: {SERVER_URL}')

    while True:
        try:
            payload = build_payload()
            send_metrics(payload)
            print(f"[{datetime.now().strftime('%H:%M:%S')}] Métricas enviadass com sucesso.")
        except Exception as error:
            print(f'Erro ao enviar métricas: {error}')

        time.sleep(INTERVAL_SECONDS)
