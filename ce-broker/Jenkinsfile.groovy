def email = 'changsu.im@wizontech.com'
def binary = 'ce-broker'

node {
  currentBuild.result = "SUCCESS"

  try {
    stage 'checkout'
    checkout scm

    stage('dependency') {
      withEnv(['PATH+EXTRA=/usr/sbin:/usr/bin:/sbin:/bin']) {
        echo "My branch is: ${env.NODE_NAME}"
        echo 'env.PATH=' + env.PATH
        if (env.NODE_NAME == 'master') {
          echo 'I only execute on the master branch'
        } else {
          echo 'I execute elsewhere'
        }
        sh 'pwd'
        sh('printenv')
      }
    }

    stage('build') {
      withEnv(['PATH+EXTRA=/usr/bin:/bin:/usr/local/go/bin']) {
        sh "go build -o ${binary} ./main.go"
        sh 'sudo make docker'
      }
    }

    stage('complete') {
      mail body: 'project build successful',
      from: "${email}",
      // replyTo: 'changsu.im@wizontech.com',
      subject: 'project build successful',
      to: "${email}"
    }
  }
  catch (err) {
    currentBuild.result = "FAILURE"

    mail body: "project build error is here: ${env.BUILD_URL}\n error: ${err}" ,
    from: "${email}",
    // replyTo: 'changsu.im@wizontech.com',
    subject: 'project build failed',
    to: "${email}"

    throw err
  }
}