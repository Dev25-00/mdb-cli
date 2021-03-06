'use strict';

const AuthHandler = require('./auth-handler');
const HttpWrapper = require('../utils/http-wrapper');
const config = require('../config');

class ProjectsHandler {

    constructor(authHandler = new AuthHandler()) {

        this.result = [];
        this.authHeaders = {};
        this.authHandler = authHandler;

        this.setAuthHeader();
    }

    setAuthHeader() {

        this.result = this.authHandler.result;
        this.authHeaders = this.authHandler.headers;
    }

    getResult() {

        return this.result;
    }

    fetchProjects() {

        const options = {
            port: config.port,
            hostname: config.host,
            path: '/project',
            data: '',
            headers: this.authHeaders
        };

        const http = new HttpWrapper(options);

        return http.get().then((projects) => {
            projects = typeof projects === 'string' ? JSON.parse(projects) : projects;
            this.result = projects.map((project) => ({
                'Project Name': project.projectName,
                'Project URL': `https://mdbootstrap.com/projects/${project.userNicename}/${project.projectName}/`,
                'Project Published': new Date(project.publishDate).toLocaleString(),
                'Project Edited': new Date(project.editDate).toLocaleString()
            }));
        });
    }
}


module.exports = ProjectsHandler;