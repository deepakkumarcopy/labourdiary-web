//Deployment development: pm2 deploy ecosystem.config.js development
//Deployment staging: pm2 deploy ecosystem.config.js staging
//Deployment production: pm2 deploy ecosystem.config.js production
//Deployment preprod: pm2 deploy ecosystem.config.js preprod

module.exports = {
    apps: [{
      'name': 'LabourDiway',
      'script': 'index.js',
      'watch': false,
      'instances': 1
    }],
  
    deploy: {
      production: {
        'user': 'ubuntu',
        'host': '52.14.3.171',
        'ref': 'origin/master',
        'repo': 'git@github.com:deepakkumarcopy/labourdiary-web.git',
        'path': 'home/ubuntu/labourdiary-web',
        'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production && npm run build-prod'
      },
    //   stagingold: {
    //     'user': 'w3villa',
    //     'host': '3.10.4.210',
    //     'ref': 'origin/staging',
    //     'repo': 'git@github.com:superonegit/superwebapp3.0.git',
    //     'path': '/home/w3villa/superwebapp3.0',
    //     'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env stagingold && npm run build-staging-old'
    //   },
    //   staging: {
    //     'user': 'ubuntu',
    //     'host': '35.177.5.130',
    //     'ref': 'origin/staging',
    //     'repo': 'git@github.com:superonegit/superwebapp3.0.git',
    //     'path': '/home/ubuntu/webapp/staging',
    //     'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env staging && npm run build-staging'
    //   },
    //   development: {
    //     'user': 'ubuntu',
    //     'host': '35.177.5.130',
    //     'ref': 'origin/development',
    //     'repo': 'git@github.com:superonegit/superwebapp3.0.git',
    //     'path': '/home/ubuntu/webapp/development',
    //     'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env development && npm run build-development'
    //   },
    //   preprod: {
    //     'user': 'ubuntu',
    //     'host': '35.177.5.130',
    //     'ref': 'origin/pre-prod',
    //     'repo': 'git@github.com:superonegit/superwebapp3.0.git',
    //     'path': '/home/ubuntu/webapp/preprod',
    //     'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env preprod && npm run build-preprod'
    //   }
    }
  };
  