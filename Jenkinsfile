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

    stage('Deploy (SAFE SYNC — ADMIN MATCH)') {
      steps {
        sh '''
          set -e
          echo "🚀 Deploying employee frontend"

          docker exec ${CONTAINER_NAME} mkdir -p /usr/local/apache2/htdocs_new

      # copy CONTENTS, not repo folder
          docker cp . ${CONTAINER_NAME}:/usr/local/apache2/htdocs_new/

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
      echo "✅ FRONTEND DEPLOYED INTO DOCKER CONTAINER"
    }
    failure {
      echo "❌ DEPLOY FAILED — CONTAINER NOT MODIFIED"
    }
  }
}

