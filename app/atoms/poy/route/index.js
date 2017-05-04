/**
 * revenue target progress overview
 */

var moment = require('moment');

module.exports = router => {
    router.get('/rtpo', function(req, res) {
        const exptectedRevenuePerMonth = 3;
        let year = req.query.year || 2016;
        let intervalByMonth = req.query.interval || 12;
        if(intervalByMonth > 12) {
            intervalByMonth = 12;
        }
        let currentMonth = moment().month() + 1;

        let poyDataOfYear = resolveMonthsRevenueDataByYear(year);
        let filteredProjects = poyDataOfYear.filter(item => {
            let eventMonth = moment(item.dateBegin).month() + 1;
            if(currentMonth - eventMonth + 1 <= intervalByMonth) {
                return true;
            }
            return false;
            
        }); 
        let revenueTotal = 0; 
        for(let fp of filteredProjects) {
            revenueTotal += fp.revenueActual;
        }
        let exptectedRevenueTotal = exptectedRevenuePerMonth * intervalByMonth;
        let missonProgress = (revenueTotal * 100 / exptectedRevenueTotal).toFixed(0);

        let option = {
            tooltip : {
                formatter: "{a} <br/>{b} : {c}%"
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            series: [
                {
                    name: `业务指标(近${intervalByMonth}个月)`,
                    type: 'gauge',
                    detail: {formatter:'{value}%'},
                    data: [{value: missonProgress, name: 'POY营收目标进度'}]
                }
            ]
        };
        res.toApiJson({
            option,
        });
    });

    /**
     * revenue composition analysis
     */
    router.get('/rca', function(req, res) {
        let year = req.query.year || 2016;
        let poyDataOfYear = resolveMonthsRevenueDataByYear(year);
        let sortBy = req.query.sortBy || 'channel';
        let chartData = {
            legend: [],
            series: [],
        };
        let filterFunction;
        let groupSource;
        if(sortBy == 'channel') {
            groupSource = getProjectChannelsEnum();
            chartData.legend = groupSource.map(item => item.name);
            filterFunction = groupItem => {
                return item => item.channel == groupItem.id;
            } 
        } else if(sortBy == 'projectType') {
            groupSource = getProjectTypesEnum();
            chartData.legend = groupSource.map(item => item.name);
            filterFunction = groupItem => {
                return item => item.projectType == groupItem.id;
            } 
        } else if(sortBy == 'scale') {
            groupSource = getProjectScalesEnum();
            chartData.legend = groupSource.map(item => item.name);
            filterFunction = groupItem => {
                return item => item.revenueActual >= groupItem.min && item.revenueActual < groupItem.max;
            }
        }
        let includedProjectsText = '';
        for(let cs of groupSource) {
            let revenueTotal = 0;
            let filteredProjects = poyDataOfYear.filter(filterFunction(cs));
            for(let fp of filteredProjects) {
                revenueTotal += fp.revenueActual;
                includedProjectsText += fp.name + '<br />';
            }
            chartData.series.push({
                name: cs.name,
                value: revenueTotal,
            })
        }
        
        let option = {
            title : {
                text: 'POY营收组成组成分析',
                subtext: '',
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: chartData.legend,
            },
            series : [
                {
                    name: '',//includedProjectsText
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data: chartData.series,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        res.toApiJson({
            option,
        });
    });

    /**
     * revenue trend
     */
    router.get('/rt', function(req, res) {
        let interval = req.query.interval || 'month';
        let poyDataOf2015 = resolveMonthsRevenueDataByYear(2015);
        let poyDataOf2016 = resolveMonthsRevenueDataByYear(2016);
        let poyDataOfYears = [
            {
                name: '2015收入',
                projects: poyDataOf2015,    
            },
            {
                name: '2016收入',
                projects: poyDataOf2016,    
            }
        ];

        let xAxis = [];
        let monthsInterval = 1;
        if(interval == 'month') {
            xAxis = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
            monthsInterval = 1;
        } else if(interval == 'season') {
            xAxis = ["Q1","Q2","Q3","Q4"];
            monthsInterval = 3;
        } else if(interval == 'year'){
            xAxis = ["全年"];
            monthsInterval = 12;
        }

        poyDataOfYears.map(poyOfYear => {
            var monthCursor = 1;
            poyOfYear.revenuesArr = [];
            while(monthCursor <= 12) {
                let intervalProjects = poyOfYear.projects.filter(item => {
                    let projectBeginMonthIndex = moment(item.dateBegin).month() + 1;
                    if(projectBeginMonthIndex >= monthCursor && projectBeginMonthIndex < monthCursor + monthsInterval) {
                        return true;
                    }
                    return false;
                });

                let revenueTotal = 0;
                for(let targetProject of intervalProjects) {
                    revenueTotal += targetProject.revenueActual;
                }
                poyOfYear.revenuesArr.push(revenueTotal);
                monthCursor += monthsInterval;
            }
            return poyOfYear;
        })
        
        
        var option = {
                title: {
                    text: 'POY营收趋势'
                },
                tooltip: {},
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                legend: {
                    data: poyDataOfYears.map(item => item.name),
                },
                xAxis: {
                    data: xAxis,
                },
                yAxis: {},
                series: poyDataOfYears.map(item => {
                    return {
                        name: item.name,
                        type: 'bar',
                        data: item.revenuesArr,
                    }
                }),
            };
        res.toApiJson({
            option,
        }); 
    });

    function getProjectChannelsEnum() {
        return [
            {id: 1, name: '一级人脉介绍'},
            {id: 2, name: '熟人的项目'},
            {id: 3, name: '二级人脉介绍'},
            {id: 4, name: '实现网'},
            {id: 5, name: '拉勾网'},
        ];
    }

    function getProjectScalesEnum() {
        return [
            {min: 1, max: 3, name: '1-3'},
            {min: 3, max: 5, name: '3-5'},
            {min: 5, max: 10, name: '5-10'},
            {min: 10, max: 100000, name: '10以上'},
        ]
    }

    function getProjectTypesEnum() {
        return [
            {id: 0, name: '总包'},
            {id: 1, name: 'adr'},
            {id: 2, name: 'ios'},
            {id: 3, name: '跨平台'},
            {id: 4, name: '服务端'},
        ];
    }

    /**
     * channel
     *  @see getProjectChannelsEnum()
     * projectType
     *  @see getProjectTypesEnum()
     */
    function resolveMonthsRevenueDataByYear(year) {
        if(year == 2016) {
            return [
                        {
                            name: '高尔夫人二期',
                            revenueActual: 3,
                            revenueBad: 0.5,
                            dateBegin: '2016-01',
                            dateEnd: '2016-01',
                            channel: 1,
                            projectType:1,
                        },
                        {
                            name: '悟空阅读',
                            revenueActual: 1,
                            revenueBad: 1,
                            dateBegin: '2016-06',
                            dateEnd: '2016-09',
                            channel: 4,
                            projectType:1,
                        },
                        {
                            name: 'Kleering',
                            revenueActual: 1.5,
                            revenueBad: 0,
                            dateBegin: '2016-07',
                            dateEnd: '2016-09',
                            channel: 4,
                            projectType:1,
                        },
                        {
                            name: '鼎甲微联警员端',
                            revenueActual: 1.8,
                            revenueBad: 0,
                            dateBegin: '2016-07',
                            dateEnd: '2016-09',
                            channel: 4,
                            projectType:1,
                        },
                        {
                            name: '私银贵族',
                            revenueActual: 6,
                            revenueBad: 0,
                            dateBegin: '2016-09',
                            dateEnd: '2016-09',
                            channel: 1,
                            projectType:3,
                        },
                        {
                            name: '掌艺adr',
                            revenueActual: 1.5,
                            revenueBad: 0,
                            dateBegin: '2016-10',
                            dateEnd: '2016-12',
                            channel: 4,
                            projectType:1,
                        },
                        {
                            name: '掌艺RUA',
                            revenueActual: 3,
                            revenueBad: 0,
                            dateBegin: '2016-11',
                            dateEnd: '2016-11',
                            channel: 4,
                            projectType:3,
                        },
                ];
        }
        if(year == 2015) {
            return [
                        {
                            name: '高尔夫人一期',
                            revenueActual: 4.5,
                            revenueBad: 0,
                            dateBegin: '2015-03',
                            dateEnd: '2015-04',
                            channel: 1,
                            projectType:1,
                        },
                        {
                            name: '画圈圈',
                            revenueActual: 3.5,
                            revenueBad: 0,
                            dateBegin: '2015-04',
                            dateEnd: '2015-05',
                            channel: 1,
                            projectType:1,
                        },
                        {
                            name: '美美生活',
                            revenueActual: 1,
                            revenueBad: 0,
                            dateBegin: '2015-06',
                            dateEnd: '2015-06',
                            channel: 1,
                            projectType:1,
                        },
                        {
                            name: '小宇宙',
                            revenueActual: 6.5,
                            revenueBad: 0,
                            dateBegin: '2015-07',
                            dateEnd: '2015-08',
                            channel: 1,
                            projectType:1,
                        },
                        {
                            name: '小宇宙二期',
                            revenueActual: 1.8,
                            revenueBad: 0,
                            dateBegin: '2015-09',
                            dateEnd: '2015-09',
                            channel: 1,
                            projectType:1,
                        },
                        {
                            name: '瀚海文慧',
                            revenueActual: 2,
                            revenueBad: 0,
                            dateBegin: '2015-07',
                            dateEnd: '2015-08',
                            channel: 1,
                            projectType:1,
                        },
                        {
                            name: '九点半',
                            revenueActual: 5,
                            revenueBad: 0,
                            dateBegin: '2015-09',
                            dateEnd: '2015-10',
                            channel: 1,
                            projectType:1,
                        },
                        {
                            name: 'feel',
                            revenueActual: 1,
                            revenueBad: 0,
                            dateBegin: '2015-10',
                            dateEnd: '2015-10',
                            channel: 1,
                            projectType:1,
                        },
                        {
                            name: '尤物岛',
                            revenueActual: 9,
                            revenueBad: 0,
                            dateBegin: '2015-11',
                            dateEnd: '2015-12',
                            channel: 1,
                            projectType:1,
                        },
                        {
                            name: '颜妍',
                            revenueActual: 3,
                            revenueBad: 3.5,
                            dateBegin: '2015-11',
                            dateEnd: '2015-12',
                            channel: 1,
                            projectType:1,
                        },
                    ];
        }
    }    
}
