pipeline {
    agent any

    environment {
        APP_NAME   = "staging_employee"
        IMAGE_NAME = "staging_employee-ui"
        APP_PATH   = "/var/www/staging/pssemployees-frontend"
        PORT       = "3002"
    }

    stages {

        stage('Build Image') {
            steps {
                sh """
                cd ${APP_PATH}
                docker build -t ${IMAGE_NAME}:latest .
                """
            }
        }

        stage('Deploy (Safe)') {
            steps {
                sh """
                if docker ps | grep -q ${APP_NAME}; then
                    docker stop ${APP_NAME}
                    docker rm ${APP_NAME}
                fi

                docker run -d \\
                  --name ${APP_NAME} \\
                  -p ${PORT}:80 \\
                  --restart unless-stopped \\
                  ${IMAGE_NAME}:latest
                """
            }
        }

        stage('Health Check') {
            steps {
                sh """
                sleep 5
                curl -f http://127.0.0.1:${PORT}
                """
            }
        }
    }

    post {
        failure {
            echo "❌ Employee UI build failed – container untouched"
        }
    }
}

