import fetch from 'node-fetch';
import {
  loginAuth,
  adminAuth
} from '../../../middlewares/authorization';

module.exports = router => {
    router.postAsync('/query-mapping-adr', async (req, res) => {
        let weappModal = require('../model/weapp')();
        let params = req.body;
        let apps = params.apps;
        for(let app of apps) {
            let likedApps = await weappModal.findAll({
                paranoid: true,
                where: {
                    name: {
                        $like: `%${app.name}%`
                    }
                }
            });
            app.suggestedMicroApps = likedApps;
        }
        res.toApiJson(apps);
    });

    router.postAsync('/fetch-all', adminAuth, async (req, res) => {
        var weappModal = require('../model/weapp')();
        let nextUrl = '/api/v3/trochili/miniapp/?tag=&offset=24';
        let operatedItemsNum = 0;
        while(nextUrl != null) {
        console.log(`read weapps manifest from ${nextUrl}`);
        let response = await fetch(`https://minapp.com${nextUrl}`);
        let respData = await response.json();
        for(let appItem of respData.objects) {
            let existedAppItem = await weappModal.findOne({
                paranoid: true,
                where: {
                minapp_id: appItem.id
                },
            });
            if(existedAppItem) {
                console.log(`already weapp has been found:${appItem.name}, nothing updated`);
                continue;
            }
            existedAppItem = await weappModal.create({
                minapp_id: appItem.id,
                minapp_rating: appItem.overall_rating,
                name: appItem.name,
                qr_url: appItem.qrcode.image,
                created_time_at_wechat: appItem.created_at,
                icon_url: appItem.icon.image,
                description: appItem.description
            });

            let screenShots = appItem.screenshot.map(item => {
                return {
                imageUrl: item.image
                }
            });
            var screenshotModal = require('../model/screenshot')();
            let screenShotsInDb = [];
            for(let screenshot of appItem.screenshot) {
                screenShotsInDb.push(await screenshotModal.create({
                    imageUrl: screenshot.image
                }));
            };
            await existedAppItem.setScreenShots(screenShotsInDb);  
            operatedItemsNum += 1;
            console.log(`the information of weapp:${appItem.name} has been taken`);
        }
        nextUrl = respData.meta.next;
        }
        console.log(`update weapp-manifest completed:${operatedItemsNum}`);
        res.toApiJson({operatedItemsNum});
    });
}