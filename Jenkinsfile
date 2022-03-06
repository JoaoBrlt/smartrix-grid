pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        sh './prepare.sh'
      }
    }
    stage('Test') {
      steps {
        sh 'sleep 10'
        sh './run.sh'
      }
    }
  }
  post {
    always {
      sh './stop.sh'
    }
  }
}
