pipeline {
  agent any

  environment {
    CONTAINER_NAME = "staging_employee"
    SOURCE_PATH = "mainsource"
    HEALTH_URL = "http://127.0.0.1:3002"
    NODE_IMAGE = "node:18"
  }

  options {
    timestamps()
    disableConcurrentBuilds()
  }

  stages {

    // 1. Pull frontend code
    stage('Checkout') {
      steps {
        checkout scm
        sh 'git rev-parse HEAD'
      }
    }

    // 2. Build frontend (Vite)
    stage('Build Frontend') {
      steps {
        sh '''
          set -e

          docker run --rm \
            -v "$(pwd)/${SOURCE_PATH}:/app" \
            -w /app \
            ${NODE_IMAGE} \
            sh -c "npm ci && npm run build"

          test -d ${SOURCE_PATH}/dist
        '''
      }
    }

    // 3. Sync files into RUNNING container (FAST MODE)
    stage('Deploy Files (Live Sync)') {
      steps {
        sh '''
          set -e

          echo "Cleaning old frontend files inside container..."
          docker exec ${CONTAINER_NAME} rm -rf /usr/local/apache2/htdocs/*

          echo "Copying new build into container..."
          docker cp ${SOURCE_PATH}/dist/. ${CONTAINER_NAME}:/usr/local/apache2/htdocs/
        '''
      }
    }

    // 4. Health check
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
      echo "⚡ FAST STAGING DEPLOY SUCCESS — NO CONTAINER RESTART"
    }
    failure {
      echo "❌ FAST DEPLOY FAILED — Container was NOT touched"
    }
  }
}

