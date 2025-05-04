import React from 'react'
import { useGetRepo } from '../api/use-get-repo'

const ProjectGithubRepo = () => {
    const {data} = useGetRepo();

    console.log(data)
  return (
    <div>ProjectGithubRepo</div>
  )
}

export default ProjectGithubRepo