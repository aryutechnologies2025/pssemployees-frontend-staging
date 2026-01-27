pipeline {
  agent any

  environment {
    CONTAINER_NAME = "staging_employee"
    SOURCE_PATH   = "mainsource"
    HEALTH_URL   = "http://127.0.0.1:3002"
    NODE_IMAGE   = "node:18"
    DEPLOY_BRANCH = "main"
  }

  options {
    timestamps()
    disableConcurrentBuilds()
  }

  stages {

    stage('Checkout (LOCKED TO MAIN)') {
      steps {
        checkout([
          $class: 'GitSCM',
          branches: [[name: "*/${DEPLOY_BRANCH}"]],
          userRemoteConfigs: scm.userRemoteConfigs
        ])
        sh 'echo "DEPLOYING COMMIT:" && git log --oneline -1'
      }
    }

    stage('Build Frontend') {
      steps {
        sh '''
          set -e

          echo "Building frontend in Docker..."
          docker run --rm \
            -v "$(pwd)/${SOURCE_PATH}:/app" \
            -w /app \
            ${NODE_IMAGE} \
            sh -c "npm ci && npm run build"

          test -d ${SOURCE_PATH}/dist
        '''
      }
    }

    stage('Deploy (FAST SYNC — SAFE MODE)') {
      steps {
        sh '''
          set -e

          echo "Deploying into running container: ${CONTAINER_NAME}"

          docker exec ${CONTAINER_NAME} mkdir -p /usr/local/apache2/htdocs_new
          docker cp ${SOURCE_PATH}/dist/. ${CONTAINER_NAME}:/usr/local/apache2/htdocs_new

          echo "Atomic switch..."
          docker exec ${CONTAINER_NAME} sh -c "
            rm -rf /usr/local/apache2/htdocs_old || true
            mv /usr/local/apache2/htdocs /usr/local/apache2/htdocs_old
            mv /usr/local/apache2/htdocs_new /usr/local/apache2/htdocs
          "
        '''
      }
    }

    stage('Health Check') {
      steps {
        sh '''
          set -e
          sleep 3
          curl -f ${HEALTH_URL}
        '''
      }
    }
  }

  post {
    success {
      echo "✅ EMPLOYEE FRONTEND DEPLOYED FROM MAIN"
    }
    failure {
      echo "❌ DEPLOY FAILED — CONTAINER NOT TOUCHED"
    }
  }
}

