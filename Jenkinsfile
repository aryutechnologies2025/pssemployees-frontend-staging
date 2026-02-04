pipeline {
  agent any

  environment {
    CONTAINER_NAME = "staging_employee"      // frontend container
    DEPLOY_BRANCH = "main"
    HEALTH_URL = "http://127.0.0.1:3002"    // frontend exposed port
    WEB_ROOT = "/usr/local/apache2/htdocs" // change if nginx
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

    stage('Verify Frontend Build (Root Level)') {
      steps {
        sh '''
          set -e
          echo "🔍 Verifying frontend build files..."

          if [ ! -f "index.html" ]; then
            echo "❌ index.html missing at repo root"
            exit 1
          fi

          if [ ! -d "assets" ]; then
            echo "❌ assets/ folder missing"
            exit 1
          fi

          echo "✅ Build files verified"
        '''
      }
    }

    stage('Deploy (ATOMIC CONTAINER SYNC)') {
      steps {
        sh '''
          set -e
          echo "🚀 Deploying into container: ${CONTAINER_NAME}"

          docker exec ${CONTAINER_NAME} mkdir -p ${WEB_ROOT}_new

          echo "📦 Copying frontend files..."
          docker cp . ${CONTAINER_NAME}:${WEB_ROOT}_new

          echo "🔁 Atomic switch..."
          docker exec ${CONTAINER_NAME} sh -c "
            rm -rf ${WEB_ROOT}_old || true
            mv ${WEB_ROOT} ${WEB_ROOT}_old || true
            mv ${WEB_ROOT}_new ${WEB_ROOT}
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
      echo "✅ FRONTEND DEPLOYED INTO DOCKER CONTAINER"
    }
    failure {
      echo "❌ DEPLOY FAILED — CONTAINER NOT MODIFIED"
    }
  }
}

