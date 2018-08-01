// @ts-check
const { execFileSync, spawnSync } = require('child_process')

// const HYPER = 'hyper'
// const HYPER_OPTS = ['-R', 'eu-central-1']

const HYPER = '/data/bin/hyper'
const HYPER_OPTS = ['--config=/data/config/hyper']

const agentsRaw = execFileSync(
  HYPER,
  [
    ...HYPER_OPTS,
    'ps',
    '-f',
    'label=com.taskworld.hyper-selenium.role=agent',
    '--format={{ .ID }} {{ .CreatedAt }}',
  ],
  {
    encoding: 'utf8',
    timeout: 10000,
  }
)
const agents = []
agentsRaw.replace(
  /([0-9a-f]+) (\d\d\d\d-\d\d-\d\d) (\d\d:\d\d:\d\d) (\+\d\d\d\d)/g,
  (__, containerId, date, time, tz) => {
    const created = new Date(date + 'T' + time + tz)
    agents.push({ containerId, created })
    return ''
  }
)

for (const agent of agents) {
  const durationSeconds = ((Date.now() - agent.created) / 1000).toFixed(1)
  console.log(`* ${agent.containerId} ran for ${durationSeconds}s`)
}

for (const agent of agents.filter(a => Date.now() - a.created >= 600e3)) {
  console.log(`* Killing ${agent.containerId} — it ran for too long`)
  spawnSync(HYPER, [...HYPER_OPTS, 'rm', '-f', agent.containerId], {
    stdio: 'inherit',
    shell: true,
    timeout: 10000,
  })
}
