module.exports = {
    apps: [
        {
            name: 'myapp', // pm2에서 관리하는 어플리케이션의 이름
            script: 'dist/main.js', // pm2 start/ .dist/main.js
            instances: 'max', // cpu를 사용해서 애플리케이션 인스턴스를 몇개가지 실행할꺼냐?
            exec_mode: 'cluster', // `클러스터` 모드, 여러 인스턴스가 병렬로 실행될 수 있게 한다.
            watch: false, // 파일 변경을 감지할지 여부
            env: { // 환경 변수 정의할 객체
                NODE_ENV: 'development',// 애플리케이션에 환경변수를 설정한다.
                PORT: 3000,
            },
            env_production: {
                NODE_ENV: 'production',
                PORT: 3000,
            },
        },
    ],
};