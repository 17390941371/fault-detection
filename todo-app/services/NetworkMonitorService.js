export async function PingDelayService() {

  const response = await fetch('/api/ping');
  return await response.json();
}

export async function LocaltionService() {

  const response = await fetch('/api/ping/ip');
  return await response.json();
}

export async function LaLotitudeToLocation() {
  
}