import os
import sys
import subprocess
import time
import webbrowser

def main():
    print("=" * 70)
    print("🚀 National Weather Intelligence Platform (NWIP) - Starting Up...")
    print("=" * 70)

    # 1. Start FastAPI Backend Server
    print("Starting FastAPI Backend Server on http://localhost:8000...")
    backend_dir = os.path.join(os.path.dirname(__file__), "backend")
    
    env = os.environ.copy()
    node_path = r"C:\Users\kumar\nodejs"
    if os.path.exists(node_path):
        env["PATH"] = node_path + os.pathsep + env.get("PATH", "")

    backend_cmd = [sys.executable, "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
    backend_proc = subprocess.Popen(backend_cmd, cwd=backend_dir, env=env)

    time.sleep(3)

    # 2. Start Vite Frontend Server
    print("Starting Vite Frontend Server on http://localhost:3000...")
    frontend_dir = os.path.join(os.path.dirname(__file__), "frontend")
    
    npm_bin = os.path.join(node_path, "npm.cmd") if os.path.exists(node_path) else "npm"
    frontend_cmd = [npm_bin, "run", "dev"]
    frontend_proc = subprocess.Popen(frontend_cmd, cwd=frontend_dir, env=env, shell=True)

    print("\n" + "=" * 70)
    print("✅ NWIP Platform is running!")
    print("📍 Frontend Dashboard: http://localhost:3000")
    print("📍 Backend API & Docs: http://localhost:8000/docs")
    print("📍 WebSocket Live Feed: ws://localhost:8000/ws/events")
    print("=" * 70 + "\n")

    time.sleep(2)
    try:
        webbrowser.open("http://localhost:3000")
    except Exception:
        pass

    try:
        backend_proc.wait()
        frontend_proc.wait()
    except KeyboardInterrupt:
        print("\nShutting down NWIP servers...")
        backend_proc.terminate()
        frontend_proc.terminate()

if __name__ == "__main__":
    main()
