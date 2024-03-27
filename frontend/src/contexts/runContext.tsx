import { createContext, useContext, useEffect, useState } from "react"
import {
  buildApiStatusType,
  buildPresetType,
  get_builds,
  get_runs,
  localRunType,
  run_start,
  run_status,
  run_stop,
} from "../api/bot"
import { buildContext } from "./buildContext"
import toast from "react-hot-toast"

export type runApiType = {
  id: number
  status: buildApiStatusType
  timestamp: number
  preset_name: string
  build_id: number
  logs?: string[]
  logs_path?: string
}

type RunContextType = {
  runs: localRunType[]
  setRuns: React.Dispatch<React.SetStateAction<localRunType[]>>
  run: boolean
  setRun: React.Dispatch<React.SetStateAction<boolean>>
  runPending: boolean
  setRunPending: React.Dispatch<React.SetStateAction<boolean>>
  runStart: (preset: buildPresetType) => void
  runStop: () => void
  runStatus: buildApiStatusType
  setRunStatus: React.Dispatch<React.SetStateAction<buildApiStatusType>>
}

export const runContext = createContext({
  setRuns: () => {},
  runs: [],
  run: false,
  setRun: () => {},
  runPending: false,
  setRunPending: () => {},
  runStart: async () => {},
  runStop: () => {},
  setRunStatus: () => {},
  runStatus: "stopped",
} as RunContextType)

export const RunProvider = ({ children }: { children: React.ReactNode }) => {
  const [run, setRun] = useState(false)
  const [runPending, setRunPending] = useState(false)
  const [runStatus, setRunStatus] = useState<buildApiStatusType>("stopped")
  const [runs, setRuns] = useState<localRunType[]>([])
  const { setBuilds } = useContext(buildContext)

  const getRunInitial = async () => {
    const { data } = await get_runs()
    console.log(data)
    if (data.run) {
      setRuns(data.run.map((run) => ({ ...run, type: "run" })))
    }
  }

  useEffect(() => {
    getRunInitial()
  }, [])

  const runStart = async ({
    duration = 60,
    end_status = "completed",
    name = "default",
  }: buildPresetType) => {
    setRunPending((prev) => true)
    setRunStatus("running")
    try {
      const { data: start_res } = await run_start({ duration, end_status, name })
      setRuns((prev) => [...prev, { ...start_res.run_info, type: "run" }])
      const { data: b } = await get_builds()
      setBuilds((prev) =>
        b.build.map((build) => ({
          ...build,
          type: "build",
          runs: build.runs.map((run) => ({ ...run, type: "run" })),
        }))
      )
      let flag = true
      let timer = 0
      const timerId = setInterval(() => timer++, 500)
      while (flag) {
        if (timer > 9999) {
          setRunPending((prev) => false)
          setRun((prev) => false)
          setRunStatus("failed")
          toast.error("Run timeout error!")
          return (flag = false)
        }
        // const { data: status } = await run_status()
        // if (status !== "running") {
        //   flag = false
        //   const {
        //     data: { run },
        //   } = await get_runs()
        //   setRuns((prev) => run.map((run) => ({ ...run, type: "run" })))
        //   const { data: b } = await get_builds()
        //   setBuilds((prev) =>
        //     b.build.map((build) => ({
        //       ...build,
        //       type: "build",
        //       runs: build.runs.map((run) => ({ ...run, type: "run" })),
        //     }))
        //   )
        //   if (status === "completed") {
        //     setRunPending((prev) => false)
        //     setRunStatus("completed")
        //     setRun((prev) => false)
        //     toast.success("Run successfully closed!")
        //   } else if (status === "failed") {
        //     setRunPending((prev) => false)
        //     setRunStatus("failed")
        //     setRun((prev) => false)
        //     toast.error("Run failed!")
        //   }
        // } else {
        //   const {
        //     data: { run },
        //   } = await get_runs()
        //   setRuns((prev) => run.map((run) => ({ ...run, type: "run" })))
        //   const { data: b } = await get_builds()
        //   setBuilds((prev) =>
        //     b.build.map((build) => ({
        //       ...build,
        //       type: "build",
        //       runs: build.runs.map((run) => ({ ...run, type: "run" })),
        //     }))
        //   )
        //   setRunPending((prev) => true)
        //   setRunStatus("running")
        //   setRun((prev) => true)
        // }
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
      clearInterval(timerId)
    } catch (error) {
      console.log(error)
    } finally {
      setRunPending((prev) => false)
    }
  }

  async function runStop() {
    try {
      const res = await run_stop()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <runContext.Provider
      value={{
        run,
        setRun,
        runPending,
        setRunPending,
        runStart,
        runStop,
        runStatus,
        runs,
        setRuns,
        setRunStatus,
      }}>
      {children}
    </runContext.Provider>
  )
}
