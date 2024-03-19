import { v4 } from "uuid";
import { $v1 } from ".";
import { AxiosResponse } from "axios";

export type buildApiStatusType = 'completed' | 'failed' | 'running' | 'stopped'

export type buildPresetType = {
  name: string
  duration: number
  end_status: buildApiStatusType
}


export type buildResponseType = {
  status?: string
  build_info: buildApiType
}

export type runApiType = {
  id: number
  status: buildApiStatusType
  timestamp: number
  preset_name: string
  build_id: number
  logs?: string[]
  logs_path?: string
}

export type buildApiType = {
  id: number
  status: buildApiStatusType
  log_path: string
  logs: string[]
  preset_name: string
  timestamp: number
  runs: runApiType[]
}

type buildsResponseType = {
  status?: string
  build: buildApiType[]
}

type runsResponseType = {
  status?: string
  run: runApiType[]
}

type runResponseType = {
  status?: string
  run_info: runApiType
}

export const build_start = async (preset?: buildPresetType): Promise<AxiosResponse<buildResponseType>> => {
  return await $v1.post("/bot/build/start", preset ?? {
    name: "build" + v4(),
    duration: 4,
    end_status: "completed",
  })
}

export const build_status = async (): Promise<AxiosResponse<buildApiStatusType>> => {
  return await $v1.get("/bot/build/status")
}

export const build_stop = async () => {
  return await $v1.get("/bot/build/stop")
}

export const get_builds = async (): Promise<AxiosResponse<buildsResponseType>> => {
  return await $v1.get("/bot/builds")
}

export const get_runs = async (): Promise<AxiosResponse<runsResponseType>> => {
  return await $v1.get("/bot/runs")
}

export const run_start = async (preset?: buildPresetType): Promise<AxiosResponse<runResponseType>> => {
  return await $v1.post("/bot/run/start", preset ?? {
    name: "run" + v4(),
    duration: 4,
    end_status: "completed",
  })
}

export const run_stop = async () => {
  return await $v1.get("/bot/run/stop")
}

export const run_status = async (): Promise<AxiosResponse<buildApiStatusType>> => {
  return await $v1.get("/bot/run/status")
}