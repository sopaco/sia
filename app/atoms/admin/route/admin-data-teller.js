var dataOperator = require('../service/data-teller/data-operator')

import {
  loginAuth,
  adminAuth
} from '../../../middlewares/authorization';

module.exports = router => {
    router.postAsync('/adt', adminAuth, async function(req, res) {
        let params = req.body;
        let {
            target,
            operation,
            option,
        } = params;
        let result = await dataOperator[operation](target, option);
        res.toApiJson({
            params,
            data: result,
            schema: await dataOperator.querySchema(target)
        });
    });

    router.postAsync('/adexport', adminAuth, async function(req, res) {
        let params = req.body;
        let {
            target,
            operation,
            option,
        } = params;
        let result = await dataOperator[operation](target, option);

        let fieldsConfigName = option.fieldsConfigName;
        let fieldsConfig = require(`../assets/smc/pages-config/${fieldsConfigName}`);
        let readableResult = result.map(dbRecord => {
            let record = JSON.parse(JSON.stringify(dbRecord));
            let fieldKeys = Object.keys(record);
            for(let fieldKey of fieldKeys) {
                let fieldConfig = fieldsConfig[fieldKey];
                if(!fieldConfig || fieldConfig.hidden) {
                    console.log(fieldKey)
                    delete record[fieldKey];
                    continue;
                }
                if(fieldConfig.valueConverter) {
                    record[fieldKey] = fieldConfig.valueConverter(record[fieldKey]);
                }
            }
            return record;
        });
        let excelRows = readableResult.map(record => {
            let fieldKeys = Object.keys(record);
            let result = [];
            for(let fieldKey of fieldKeys) {
                result.push(record[fieldKey]);
            }
            return result;
        });
        
        let nodeExcel = require('excel-export');
        let excelConfig = {};
        // excelConfig.stylesXmlFile = "styles.xml";
        excelConfig.name = `${target.module}-${target.entityName}-[excel-generated-by-smc]`;
        excelConfig.cols = Object.keys(fieldsConfig).filter(fieldKey => {
            return !fieldsConfig[fieldKey].hidden;
        }).map(fieldKey => {
            return {
                caption:fieldsConfig[fieldKey].name,
                type:'string'
            }
        });
        excelConfig.rows = excelRows;

        let excelResult = nodeExcel.execute(excelConfig);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
        res.end(excelResult, 'binary');
        console.log(JSON.stringify(excelConfig));
    });
};