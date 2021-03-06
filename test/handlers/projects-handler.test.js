'use strict';

const AuthHandler = require('../../utils/auth-handler');
const HttpWrapper = require('../../utils/http-wrapper');
const sandbox = require('sinon').createSandbox();

describe('Handler: Projects', () => {

    let projectsHandler;
    let ProjectsHandler;
    let authHandler;

    beforeEach(() => {

        ProjectsHandler = require('../../utils/projects-handler');
        authHandler = new AuthHandler(false);
    });

    afterEach(() => {

        authHandler = undefined;
        sandbox.reset();
        sandbox.restore();
    });

    it('should have assigned authHandler', () => {

        projectsHandler = new ProjectsHandler();

        expect(projectsHandler).to.have.property('authHandler');
        expect(projectsHandler.authHandler).to.be.an.instanceOf(AuthHandler);
    });

    it('should fetch user projects and return expected result', async () => {

        const projects = [{
            projectId: 123,
            userNicename: 'fakeNicename',
            projectName: 'fakeProjectName',
            publishDate: '2019-06-24T06:49:53.000Z',
            editDate: '2019-06-24T06:49:53.000Z'
        }];
        const formatedResult = [{
            'Project Name': 'fakeProjectName',
            'Project URL': 'https://mdbootstrap.com/projects/fakeNicename/fakeProjectName/',
            'Project Published': new Date(projects[0].publishDate).toLocaleString(),
            'Project Edited': new Date(projects[0].editDate).toLocaleString()
        }];
        sandbox.stub(HttpWrapper.prototype, 'get').resolves(projects);
        projectsHandler = new ProjectsHandler();

        await projectsHandler.fetchProjects();

        const result = projectsHandler.getResult();

        expect(result).to.be.an('Array');
        expect(result).to.be.deep.equal(formatedResult);
    });

    it('should fetch user projects, parse to JSON and return expected result', async () => {

        const projects = `[{
            "projectId":123,
            "userNicename":"fakeNicename",
            "projectName":"fakeProjectName",
            "publishDate":"2019-06-24T06:49:53.000Z",
            "editDate":"2019-06-24T06:49:53.000Z"
        }]`;
        const projectsJson = JSON.parse(projects);
        const formatedResult = [{
            'Project Name': 'fakeProjectName',
            'Project URL': 'https://mdbootstrap.com/projects/fakeNicename/fakeProjectName/',
            'Project Published': new Date(projectsJson[0].publishDate).toLocaleString(),
            'Project Edited': new Date(projectsJson[0].editDate).toLocaleString()
        }];
        sandbox.stub(HttpWrapper.prototype, 'get').resolves(projects);
        const parseSpy = sandbox.spy(JSON, 'parse');
        projectsHandler = new ProjectsHandler();

        await projectsHandler.fetchProjects();

        const result = projectsHandler.getResult();

        expect(result).to.be.an('Array');
        expect(result).to.be.deep.equal(formatedResult);
        expect(parseSpy.calledOnce).to.be.true;
    });
});