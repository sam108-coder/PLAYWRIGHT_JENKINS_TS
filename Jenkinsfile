pipeline {
    agent any

    parameters {
        choice(
            name: 'ENVIRONMENT',
            choices: ['qa', 'dev', 'prod'],
            description: 'Target test environment'
        )
        choice(
            name: 'BROWSER',
            choices: ['chromium', 'firefox', 'webkit', 'all'],
            description: 'Browser for test execution'
        )
        choice(
            name: 'TEST_SUITE',
            choices: ['all', '@smoke', '@regression', '@ddt', '@e2e'],
            description: 'Test category / Tag filter'
        )
        booleanParam(
            name: 'HEADLESS',
            defaultValue: true,
            description: 'Run tests in headless mode'
        )
        string(
            name: 'WORKERS',
            defaultValue: '2',
            description: 'Number of parallel workers'
        )
    }

    environment {
        CI = 'true'
        TEST_ENV = "${params.ENVIRONMENT}"
        HEADLESS = "${params.HEADLESS}"
    }

    options {
        timeout(time: 60, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '30'))
    }

    stages {
        stage('Checkout') {
            steps {
                echo "Pulling latest test codebase..."
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "Installing npm dependencies..."
                script {
                    if (isUnix()) {
                        sh 'npm ci || npm install'
                    } else {
                        bat 'npm ci || npm install'
                    }
                }
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                echo "Installing Playwright browsers..."
                script {
                    def browserArg = (params.BROWSER == 'all') ? '' : params.BROWSER
                    if (isUnix()) {
                        sh "npx playwright install --with-deps ${browserArg}"
                    } else {
                        bat "npx playwright install ${browserArg}"
                    }
                }
            }
        }

        stage('Type Check & Validation') {
            steps {
                echo "Running TypeScript verification..."
                script {
                    if (isUnix()) {
                        sh 'npm run typecheck'
                    } else {
                        bat 'npm run typecheck'
                    }
                }
            }
        }

        stage('Execute Playwright Tests') {
            steps {
                echo "Running tests in [${params.ENVIRONMENT}] on [${params.BROWSER}] with tag [${params.TEST_SUITE}]..."
                script {
                    def projectArg = (params.BROWSER == 'all') ? '' : "--project=${params.BROWSER}"
                    def grepArg = (params.TEST_SUITE == 'all') ? '' : "--grep=\"${params.TEST_SUITE}\""
                    def workersArg = "--workers=${params.WORKERS}"
                    def cmd = "npx playwright test ${projectArg} ${grepArg} ${workersArg}"

                    echo "Executing command: ${cmd}"
                    try {
                        if (isUnix()) {
                            sh cmd
                        } else {
                            bat cmd
                        }
                    } catch (err) {
                        echo "Tests finished with failures. Setting build to UNSTABLE."
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
        }
    }

    post {
        always {
            echo "Publishing test results and reports..."

            // 1. Allure Report Generation & Publishing
            script {
                try {
                    allure([
                        commandline: 'Allure Commandline',
                        includeProperties: false,
                        jdk: '',
                        properties: [],
                        reportBuildPolicy: 'ALWAYS',
                        results: [[path: 'allure-results']]
                    ])
                } catch (err) {
                    echo "Allure plugin not configured on Jenkins, generating report via CLI..."
                    if (isUnix()) {
                        sh 'npm run allure:generate || true'
                    } else {
                        bat 'npm run allure:generate || exit 0'
                    }
                }
            }

            // 2. Playwright HTML Report Publishing
            script {
                try {
                    publishHTML([
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'playwright-report',
                        reportFiles: 'index.html',
                        reportName: 'Playwright HTML Report'
                    ])
                } catch (err) {
                    echo "PublishHTML step skipped or unavailable."
                }
            }

            // 3. Archive Test Results & Artifacts
            archiveArtifacts(
                artifacts: 'test-results/**, playwright-report/**, allure-report/**',
                allowEmptyArchive: true
            )

            // 4. Publish JUnit Test Results
            junit testResults: 'test-results/junit-results.xml', allowEmptyResults: true
        }

        success {
            echo "Pipeline succeeded! All tests passed."
        }

        unstable {
            echo "Pipeline completed with test failures."
        }

        failure {
            echo "Pipeline failed during setup or execution."
        }
    }
}

