pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.49.1-jammy'
            args '-u root:root'
        }
    }

    environment {
        CI = 'true'
        BASE_URL = credentials('STAGING_BASE_URL')
        API_BASE_URL = credentials('STAGING_API_BASE_URL')
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '20'))
    }

    stages {
        stage('Checkout & Setup') {
            steps {
                echo '📦 Installing Node dependencies...'
                sh 'npm ci'
            }
        }

        stage('Generate BDD Step Tests') {
            steps {
                echo '🥒 Generating Playwright BDD Spec Files...'
                sh 'npm run bdd:gen'
            }
        }

        stage('Run Playwright Tests') {
            steps {
                echo '🚀 Executing Automated Tests with Parallel Workers...'
                sh 'npm run test || true'
            }
        }
    }

    post {
        always {
            echo '📊 Publishing Test Reports...'
            junit testResults: 'results/junit-report.xml', allowEmptyResults: true
            
            publishHTML([
                allowMissing: true,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright HTML Report'
            ])

            allure([
                includeProperties: false,
                jdk: '',
                properties: [],
                reportBuildPolicy: 'ALWAYS',
                results: [[path: 'allure-results']]
            ])
        }
        failure {
            echo '❌ Test execution encountered failures! Check reports and artifacts.'
        }
    }
}
