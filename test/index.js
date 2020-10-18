const expect = require('chai').expect;
const sinon = require('sinon');

const Position = require('../models/positionsModel');
const PositionRouter = require('../routes/positions');

const AuthenticationRouter = require('../routes/authentication');
const DashboardRouter = require('../routes/dashboard');

describe("Position Router",function(){
    it('should return all the open positions from db',function(){
        const position=[{
            projectname:"test1",
            clientname:"test1",
            technologies:"test1",
            role:"test1",
            jobDescription:"test1",
            status:"open",
            createdby:"testuser"
        }];
        sinon.stub(Position,'find');
        Position.find.returns(position);

        const res={
            render:function(body){
                return body
            }
        };
        //check this function was called or not
        sinon.spy(res,'render');

        PositionRouter.get({},()=>{
            expect(res.render.called).to.be.true;
            expect(res.render.called).to.be.with(position);
        });

    });
    it('should show position list if login user is employee',function(){

         const position=[{
                projectname:"test1",
                clientname:"test1",
                technologies:"test1",
                role:"test1",
                jobDescription:"test1",
                status:"open",
                createdby:"testuser"
            }];
             Position.find.returns(position);

            const res={
                render:function(body){
                    return body
                }
            };

            PositionRouter.get('/',(res,req,next)=>{ next()},()=>{
                expect(res.render.called).to.be.true;
                expect(res.render.called).to.be.with('positions/positionList');
            });
    });
    it('should not show position list if login user is manager',function(){
        const position=[{
            projectname:"test1",
            clientname:"test1",
            technologies:"test1",
            role:"test1",
            jobDescription:"test1",
            status:"open",
            createdby:"testuser"
        }];
         Position.find.returns(position);

        const res={
            render:function(body){
                return body
            }
        };

        PositionRouter.get('/',(res,req,next)=>{ res.render('unauthorized')},()=>{
            expect(res.render.called).to.be.true;
            expect(res.render.called).to.be.with('unauthorized');
        });
    });
    it('should add new position succesfully',function(){

        const res={
            json:function(body){
                return body
            }
        };

        PositionRouter.post('/addposition',()=>{
            expect(res.json.called).to.be.true;
            expect(res.json.called).to.be.with(position);
        });
    });
    it('should return error if error occured while adding new position',function(){
        const res={
            render:function(body){
                return body
            }
        };
        const error=[{
           status:404,
           stack:'stack',
           message:'error occured'
        }];
         Position.find.returns(error);

        PositionRouter.post('/updatestatusofposition',()=>{
            expect(res.render.called).to.be.true;
            expect(res.render.called).to.be.with('error');
        });
    });

    it('should be able to successfully applied for the position',function(){
        const res={
            json:function(body){
                return body
            }
        };
        const position=[{
            projectname:"test1",
            clientname:"test1",
            technologies:"test1",
            role:"test1",
            jobDescription:"test1",
            status:"open",
            createdby:"testuser"
        }];
         Position.find.returns(position);
 
        PositionRouter.post('/userrequestedposition/1',()=>{
            expect(res.json.called).to.be.true;
            expect(res.json.called).to.be.with(position);
        });
    });
    it('should render update status page for status change',function(){
        const position=[{
            projectname:"test1",
            clientname:"test1",
            technologies:"test1",
            role:"test1",
            jobDescription:"test1",
            status:"open",
            createdby:"testuser"
        }];
         Position.find.returns(position);

        const res={
            render:function(body){
                return body
            }
        };

        PositionRouter.get('/updatestatusofposition',()=>{
            expect(res.render.called).to.be.true;
            expect(res.render.called).to.be.with('positions/updateposition');
        });
    });
});

describe("Authentication Router",function(){
    it('should render registration page on calling registration api',function(){
        const res={
            render:function(body){
                return body
            }
        };
        //check this function was called or not
        sinon.spy(res,'render');

        AuthenticationRouter.get('/register',()=>{
            expect(res.render.called).to.be.true;
            expect(res.render.called).to.be.with('loginRegister/register');
        });

    });  
 
    it('should render login page on calling login api',function(){
        const res={
            render:function(body){
                return body
            }
        };
        //check this function was called or not
        sinon.spy(res,'render');

        AuthenticationRouter.get('/login',()=>{
            expect(res.render.called).to.be.true;
            expect(res.render.called).to.be.with('loginRegister/login');
        });

    });
});

describe("DashBoard Router",function(){
    it('should render registration page on calling registration api',function(){
        const res={
            render:function(body){
                return body
            }
        };
        //check this function was called or not
        sinon.spy(res,'render');

        DashboardRouter.get('/',()=>{
            expect(res.render.called).to.be.true;
            expect(res.render.called).to.be.with('dashboard/index');
        });

    });  
});


