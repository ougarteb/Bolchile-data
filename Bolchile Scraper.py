from curl_cffi import requests
import json

# ==========================================
# CONFIGURACIÓN
# ==========================================
MI_COOKIE_REAL = 'cwr_u=92fa2eab-1610-42a0-8b0d-1f7860f21bc6; _ga=GA1.1.927593839.1770811695; _ga_3FF4HMB2TS=GS2.1.s1770909199$o4$g1$t1770912553$j37$l0$h0; cwr_s=eyJzZXNzaW9uSWQiOiJmYTY1NWQ1OS0wM2U4LTRkMTMtYjMwNy05NGQwMjgxYjljNDMiLCJyZWNvcmQiOnRydWUsImV2ZW50Q291bnQiOjE5MywicGFnZSI6eyJwYWdlSWQiOiIvZG9sbGFyIiwicGFyZW50UGFnZUlkIjoiL1ByZW1pdW1QbGFuc0l0ZW1zIiwiaW50ZXJhY3Rpb24iOjgsInJlZmVycmVyIjoiIiwicmVmZXJyZXJEb21haW4iOiIiLCJzdGFydCI6MTc3MDkxMjU1MjIyOX19'

N8N_WEBHOOK_URL = "https://n8n.oscarugarte.cl/webhook-test/bolchile-data"

def extraer_sigiloso():
    print("Intentando bypass de nivel TLS con disfraz de Safari...")
    
    headers = {
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.5 Safari/605.1.15',
        'cookie': MI_COOKIE_REAL,
    }

    try:
        # 'impersonate' cambia el saludo de red (TLS fingerprint)
        # Probaremos con 'safari15_5' para variar el patrón
        response = requests.get(
            "https://bolchile.com/dollar", 
            headers=headers, 
            impersonate="safari15_5",
            timeout=30
        )
        
        print(f"Respuesta del servidor: {response.status_code}")
        
        if response.status_code == 200:
            print("¡CONEXIÓN LOGRADA!")
            if "Precio promedio" in response.text:
                print("Datos encontrados. Enviando a n8n...")
                requests.post(N8N_WEBHOOK_URL, json={"status": "exito_sigilo", "html_preview": response.text[:300]})
            else:
                print("Conexión abierta pero no veo los datos. Posible redirección.")
        else:
            print(f"El firewall respondió con error: {response.status_code}")

    except Exception as e:
        print(f"Fallo de conexión: {e}")

if __name__ == "__main__":
    extraer_sigiloso()