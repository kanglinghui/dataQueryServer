
    const {Sequelize ,Op} = require("sequelize");
    const sequelize = new Sequelize({
        host: "localhost",
        dialect: "sqlite",

        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 1000
        },
        storage: "./database.sqlite",
        operatorsAliases: false
    });
    const MdList = sequelize.define("mdList", {
        tableName: Sequelize.STRING,
        EnTableName: Sequelize.STRING,
        updateTime: Sequelize.DATE,
        md: Sequelize.STRING,
        html: Sequelize.STRING,
        name: Sequelize.STRING,
        nameUrl: Sequelize.STRING,
        status: Sequelize.INTEGER
    });
    // 新增表
    class DB {
        async addMd(data){
            try {
                await sequelize.authenticate();
                    // 插入数据
                return sequelize.sync().then(()=> MdList.create({
                    ...data,
                    updateTime: new Date()
                })).then(jane => {
                    return { resMsg:"创建成功",isSuccess:true,list:jane.toJSON() }
                })
            } catch (error) {
                msg = { errorMessage:"数据库异常",isSuccess:false }
                console.error('Unable to connect to the database:', error);
            }  
            // return msg;            
        }
        async queryMd(name = ""){
            try {
                await sequelize.authenticate();
                // 查询
                return sequelize.sync()
                .then(() => MdList.findAll({
                    where: {
                        [Op.or]: [
                        {tableName: {
                            [Op.like]: `%${name}%`
                        }},
                        {EnTableName: {
                            [Op.like]: `%${name}%`
                        }}
                    ]
                    }
                    // offset: 10,
                    // limit: 10,
                    // order: db.sequelize.literal('id DESC')  // 倒序
                }))
                .then(jane => {
                    // result = res
                    return {
                        resMsg: "成功",
                        isSuccess: true,
                        list: JSON.parse(JSON.stringify(jane, null, 4))
                    }
                })
            } catch (error) {
                console.error('Unable to connect to the database:', error);
                return { errorMessage:"数据库异常",isSuccess:false }
            }   
        }
        async updateMd(id,data){
            try {
                await sequelize.authenticate();
                const params = { ...data,updateTime:new Date() };
                return sequelize.sync()
                .then(()=> MdList.update(params, {
                    where: {
                       id: id
                    }
                })).then(res => {
                    return { resMsg: "数据更新成!",isSuccess: true }
                })
            } catch(err) {
                return { errorMessage:"数据库异常",isSuccess:false }
            }
        }
        async delRow(id) {
        	try {
        		await sequelize.authenticate();
        		return sequelize.sync()
                .then(()=> MdList.destroy({
                    where: {
                       id: id
                    }
                })).then(res => {
                    return { resMsg: "数据更新成!",isSuccess: true }
                })
        	} catch (err) {
        		return { errorMessage:"数据库异常",isSuccess: false }
        	}	
        }
    }
    module.exports = new DB();