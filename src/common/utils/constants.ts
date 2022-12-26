export const DEPLOYMENT_TYPE_STATUS = {
  ENABLED: 'enabled',
  DISABLED: 'disabled'
};

export const DEPLOYMENT_STATUS = {
  QUEUED: 'queued',
  BUILDING: 'building',
  RUNNING: 'running',
  CANCELLED: 'cancelled',
  FAILED: 'failed'
};

export const JOB_NAME = {
  PULL_REPOSITORY: 'pull_repository',
  BUILD_DOCKER_IMG: 'build_docker_img',
  RUN_DOCKER_CONTAINER: 'run_docker_container',
  COMPLETE_DEPLOYMENT: 'complete_deployment'
};
