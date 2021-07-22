const router = require('koa-router')()

const db = require("../dbBase/index");
const { errLogger } = require('../logger');


router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json',
    isSuccess: true
  }
})
router.post("/add", async (ctx,next) => { 
    try{
        const params = ctx.request.body;
        const updateTime = new Date();
        if (params.tableName) {
            const res = await db.addMd({...params,updateTime:updateTime});
            ctx.body = res;
        } else {
            ctx.body = {
                isSuccess: false,
                errorMessage: "参数异常!"
            }
        }
    } catch(err) {
        console.log(err)
        errLogger.info(err)
    }
})
router.post("/query", async (ctx,next) => {
    try {
        const params = ctx.request.body;
        if (params.tableName || params.tableName === "") {
            const res = await db.queryMd(params.tableName);
            ctx.body = res;
        } else {
            ctx.body = {
                isSuccess: false,
                errorMessage: "参数异常!"
            }
        }
    } catch (err) {
        console.log(err)
        errLogger.info(err)
    }
})
router.post("/update", async (ctx,next) => {
    try {
        const params = ctx.request.body;
        if (params.id) {
            const res = await db.updateMd(params.id,{ ...params });
            ctx.body = res;
        } else {
            ctx.body = {
                isSuccess: false,
                errorMessage: "参数异常!"
            }
        }
    } catch (err) {
        console.log(err)
        errLogger.info(err)
    }
})
router.post("/delRow", async (ctx,next) => {
    try {
	const id = ctx.request.body.id;	
	if (id) {
		const res = await db.delRow(id);
		ctx.body = res;
	} else {
		ctx.body = {
			isSuccess: false,
			errorMessage: "没有获取到ID!"	
		}
	}
    } catch (err) {
        console.log(err)
        errLogger.info(err)
    }
})
router.post("/mainLog", async (ctx,next) => {
    try {
        errLogger.info(ctx)
    // const params = ctx.request.body;
    // const time = new Date();
    // const fileName = `../log/mainLog${time}.txt`;
    // fs.writeFile(fileName,params,function (err) {
    // 	 console.log(err)	
    // })
    } catch (err) {
        console.log(err)
        errLogger.info(err)
    }
})
router.post("/viewLog", async (ctx,next) => {
    try {
        errLogger.info(ctx)
    // const params = ctx.request.body;
    // const time = new Date();
    // const fileName = `../log/viewLog${time}.txt`;
    // fs.writeFile(fileName,params,function (err) {
    // 	 console.log(err)	
    // })
    } catch(err) {
        console.log(err)
        errLogger.info(err)
    }
})
module.exports = router
