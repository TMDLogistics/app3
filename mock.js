// Simple in-memory store for MOCK mode (no DB). Not for production.
const state = {
  users: [], drivers: [
    {id:'d1',name:'Driver One',vehicle:'Van L2H2',cap:3,online:true,verified:true},
    {id:'d2',name:'Driver Two',vehicle:'Car',cap:1,online:false,verified:false},
  ],
  jobs: [],
  helpers: [],
  settings: {commission:20, instantPayout:false, smartLoad:false}
};
export function mockGet(){ return state; }
export function mockAddJob(job){ state.jobs.unshift(job); return job; }
export function mockAssign(jobId, driverId){
  const j = state.jobs.find(x=>x.id===jobId); if(!j) return null; j.driver=driverId; j.status='assigned'; return j;
}
export function mockComplete(jobId){ const j=state.jobs.find(x=>x.id===jobId); if(j) j.status='completed'; return j;}
export function mockToggleDriver(id){ const d=state.drivers.find(x=>x.id===id); if(d) d.online=!d.online; return d; }
