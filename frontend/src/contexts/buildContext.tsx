import { createContext, useEffect, useState } from "react"
import { buildApiStatusType, buildApiType, buildPresetType, build_start, build_status, build_stop, get_builds } from "../api/bot"
import { apiPresetType } from "../types/buildrunTypes"
import toast from "react-hot-toast"

type BuildContextType = {
  build: boolean
  setBuild: React.Dispatch<React.SetStateAction<boolean>>
  builds: buildApiType[]
  setBuilds: React.Dispatch<React.SetStateAction<buildApiType[]>>
  buildPending: boolean
  setBuildPending: React.Dispatch<React.SetStateAction<boolean>>
  buildStart: (options: buildPresetType) => void
  buildStop: () => void
  buildStatus: string
  setBuildStatus: React.Dispatch<React.SetStateAction<buildApiStatusType>>
  logsPage: boolean
  setLogsPage: React.Dispatch<React.SetStateAction<boolean>>
}

export const buildContext = createContext({
  build: false,
  setBuild: () => {},
  builds: [],
  setBuilds: () => {},
  buildPending: false,
  setBuildPending: () => {},
  buildStart: () => {},
  buildStop: () => {},
  buildStatus: '',
  setBuildStatus: () => {},
  logsPage: false,
  setLogsPage: () => {},
} as BuildContextType)

export const BuildProvider = ({ children }: { children: React.ReactNode }) => {
  const [build, setBuild] = useState(false)
  const [buildPending, setBuildPending] = useState(false)
  const [buildStatus, setBuildStatus] = useState<buildApiStatusType>('stopped')
  const [logsPage, setLogsPage] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [builds, setBuilds] = useState<any[]>([])

  const getBuildInitial = async () => {
    const { data } = await get_builds()
    console.log(data)
    if (data.build) {
      setBuilds(data.build)
      if (data.build[data.build.length - 1].status === 'completed') {
        setBuild(true)
        setBuildStatus('completed')
      }
    }
  }

  useEffect(() => {
    getBuildInitial()
  }, [])

  const buildStart = async ({
    end_status = 'completed',
    name = 'default',
    duration = 3,
  }: buildPresetType) => {
    setBuildPending((prev) => true)
    setBuildStatus('running')
    try {
      const start_res = (await build_start({ duration, end_status, name })).data
      setBuilds((prev) => [...prev, start_res.build_info])
      let flag = true
      let timer = 0
      const timerId = setInterval(() => timer++, 1000)
      while (flag) {
        if (timer > 15) {
          setBuild((prev) => false)
          setBuildStatus('failed')
          toast.error('Build timeout!')
          await build_stop()
          return (flag = false)
        }
        const status_res = await build_status()
        console.log(status_res)
        const status = status_res.data
        console.log(status)
        if (status !== 'running') {
          flag = false
          const { build } = (await get_builds()).data
          setBuilds((prev) => build)
          if (status === 'completed') {
            setBuildStatus('completed')
            setBuild((prev) => true)
            toast.success('Build successfully!')
          } else if (status === 'failed') {
            setBuildStatus('failed')
            setBuild((prev) => false)
            toast.error('Build failed!')
          }
        }
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
      clearInterval(timerId)
    } catch (error) {
      console.log(error)
    } finally {
      setBuildPending((prev) => false)
    }
  }
  const buildStop = () => {
  }
  

  return (
    <buildContext.Provider
      value={{
        build,
        setBuild,
        buildPending,
        setBuildPending,
        buildStart,
        buildStop,
        buildStatus,
        setBuildStatus,
        builds,
        setBuilds,
        logsPage,
        setLogsPage
      }}>
      {children}
    </buildContext.Provider>
  )
}
