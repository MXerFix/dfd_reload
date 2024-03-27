import classNames from "classnames"
import { ChevronLeft, LucideMonitorDot, MessageCircleMore, Play, Wrench } from "lucide-react"
import React, { useContext, useState } from "react"
import { buildContext } from "../../contexts/buildContext"
import { Button, Spinner } from "@nextui-org/react"
import PlayIcon from "../../icons/buildmenu/PlayIcon"
import { runContext } from "../../contexts/runContext"
import ChatIcon from "../../icons/buildmenu/ChatIcon"
import MonitorIcon from "../../icons/buildmenu/MonitorIcon"
import { useSearchParams } from "react-router-dom"
import { parseSearchParams } from "../../utils"
import { chatContext } from "../../contexts/chatContext"
import StopIcon from "../../icons/buildmenu/StopIcon"

const BuildMenu = () => {
  const { buildStart, buildPending, buildStatus, setLogsPage, logsPage } = useContext(buildContext)
  const { chat, setChat } = useContext(chatContext)
  const { runStart, runPending, runStatus } = useContext(runContext)
  const [showBuildMenu, setShowBuildMenu] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()

  return (
    <div className={classNames("build-menu", !showBuildMenu && "build-menu-closed")}>
      <Button
        isIconOnly
        className={
          "bg-transparent border border-transparent hover:bg-header-btn-hover hover:border-border-darker rounded p-0 max-w-5 w-5 min-w-5 h-[34px]"
        }
        onClick={() => setShowBuildMenu(!showBuildMenu)}>
        <ChevronLeft
          className={classNames("transition-all duration-300", showBuildMenu && "rotate-180")}
        />
      </Button>
      <Button
        isIconOnly
        style={{}}
        onClick={() => runStart({ duration: 60, name: "default", end_status: "completed" })}
        // isLoading={runPending}
        spinner={
          <Spinner
            color='danger'
            size='sm'
          />
        }
        className={classNames(
          "flex items-center justify-center build-menu-item",
          !showBuildMenu && "build-menu-item-disabled"
        )}>
        {/* {!runPending ? <PlayIcon className='w-5 h-5' /> : <StopIcon className='w-5 h-5' />}*/}
        <PlayIcon className='w-5 h-5' /> 
      </Button>
      <Button
        isIconOnly
        spinner={
          <Spinner
            color='warning'
            size='sm'
          />
        }
        style={{}}
        onClick={() => buildStart({ duration: 4, name: "default", end_status: "completed" })}
        isLoading={buildPending}
        className={classNames("flex items-center justify-center build-menu-item")}>
        <Wrench className='w-5 h-5' />
        <span
          className={classNames(
            "builded-check z-10 transition-all duration-300",
            buildStatus === "completed"
              ? "bg-emerald-500"
              : buildStatus === "stopped"
              ? "bg-transparent"
              : "bg-red-500",
            buildPending && "bg-warning"
          )}
        />
      </Button>
      <Button
        onClick={() => {
          setSearchParams({
            ...parseSearchParams(searchParams),
            chat: !chat ? "opened" : "closed",
          })
          setChat(!chat)
        }}
        isIconOnly
        style={{}}
        className={classNames(
          "flex items-center justify-center build-menu-item",
          !showBuildMenu && "build-menu-item-disabled",
          chat && "build-menu-item-active"
        )}>
        <ChatIcon className='w-5 h-5' />
      </Button>
      <Button
        isIconOnly
        style={{}}
        onClick={() => {
          setSearchParams({
            ...parseSearchParams(searchParams),
            logs_page: !logsPage ? "opened" : "closed",
          })
          setLogsPage(!logsPage)
        }}
        className={classNames(
          "flex items-center justify-center build-menu-item",
          !showBuildMenu && "build-menu-item-disabled",
          logsPage && "build-menu-item-active"
        )}>
        <MonitorIcon className='w-5 h-5' />
      </Button>
    </div>
  )
}

export default BuildMenu
