import React, { useContext } from "react"
import { buildContext } from "../contexts/buildContext"
import { CheckCircle2, X } from "lucide-react"
import { Spinner } from "@nextui-org/react"
import { runContext } from "../contexts/runContext"

const Logs = () => {
  const { builds, logsPage } = useContext(buildContext)
  const { runs } = useContext(runContext)

  return (
    <div
      className='w-full h-full absolute transition-transform bg-background pt-20 pb-6 px-8 grid grid-cols-6 gap-6'
      style={{
        transform: !logsPage ? `translateX(100%)` : "translateX(0%)",
      }}>
      <div>
        <h1 className='text-3xl mb-4'>Builds</h1>
        <div className='grid gap-2 overflow-y-scroll max-h-[600px]'>
          {builds && builds.length ? (
            builds
              .sort((a, b) => b.timestamp - a.timestamp)
              .map((build) => (
                <div key={build.id} className='px-2 py-1 flex h-9 items-center justify-between'>
                  <p>Build {build.id}</p>
                  <span className="flex items-center">
                    {build.status === "completed" && <CheckCircle2 fill="var(--status-green)" stroke="white" />}{" "}
                    {build.status === "running" && <Spinner size="sm" color='danger' />}
                    {build.status === "failed" && <X color="red" />}
                  </span>
                </div>
              ))
          ) : (
            <p>No builds found</p>
          )}
        </div>
      </div>
      <div>
        <h1 className='text-3xl mb-4'>Runs</h1>
        <div className='grid gap-2 overflow-y-scroll max-h-[600px]'>
          {runs && runs.length ? (
            runs
              .sort((a, b) => b.timestamp - a.timestamp)
              .map((build) => (
                <div key={build.id} className='px-2 py-1 flex h-9 items-center justify-between'>
                  <p>Run {build.id}</p>
                  <span className="flex items-center">
                    {build.status === "completed" && <CheckCircle2 fill="var(--status-green)" stroke="white" />}{" "}
                    {build.status === "running" && <Spinner size="sm" color='danger' />}
                    {build.status === "failed" && <X color="red" />}
                  </span>
                </div>
              ))
          ) : (
            <p>No runs found</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Logs
