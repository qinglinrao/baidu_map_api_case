
/*公共的方法*/
function centerAndZoomSlow(lng, lat, num_end) {
    //alert(1);//一定要拉近镜头 不然汽车跑不动
    var num_begin = map.getZoom();
    var point_slow = new BMapGL.Point(lng,lat);
    if(num_begin < num_end){
        for (var i=num_begin;i<=num_end;i=i+0.05){
            map.centerAndZoom(point_slow, i);
        }
    }

    if(num_begin > num_end){
        for (var j=num_end;j<=num_begin;j=i+0.5){
            map.centerAndZoom(point_slow, j);
        }
    }

}

var landmarkPois = [
    {lng:91.140031,lat:29.653516,html:'(day1)拉萨风火水土藏式生活民宿',pauseTime:2}
];
var position = {
    "begin_lng": 0, "begin_lat": 0, "end_lng": 0, "end_lat": 0
};

//飞行或者步行路线
function route(icon=car, speed=3000, position=false, strokeColor="#000000", strokeWeight=3, defaultContent="", isShow=true, landmarkPois=[], drv_polyline=false){
    var lushu;
    var polyline;
    var polyline_path;
    var path = [];
    if(position){
        path = [
            new BMapGL.Point(position["begin_lng"],position["begin_lat"]), //起点坐标
            new BMapGL.Point(position["end_lng"], position["end_lat"])  //终点坐标
        ];
    }

    if(drv_polyline){
        polyline_path = drv_polyline; //如果驾驶就需要替换路线
    }else{
        polyline = new BMapGL.Polyline(path, {
            clip: false,
            geodesic: true,
            strokeColor: strokeColor,   //路线颜色
            strokeWeight: strokeWeight  //路线粗细
        });
        polyline_path = polyline.getPath();
    }


    //是否展示路线
    if(isShow){
        map.addOverlay(polyline);  //显示飞行线路
    }


    lushu = new BMapGLLib.LuShu(map, polyline_path, {
        defaultContent:defaultContent, //汽车头上标题
        geodesic: true,
        autoCenter: true,
        icon: new BMapGL.Icon(icon, new BMapGL.Size(30, 30), { anchor: new BMapGL.Size(24, 24) }), //飞机尺寸
        speed: speed,  //覆盖物移动速度，单位米/秒
        enableRotation: true,
        landmarkPois:landmarkPois
    });

    return lushu;
}

//驾车路线
function routeDrive(icon2=car, speed2=3000, position2={}, strokeColor2="#000000", strokeWeight2=3, defaultContent2="", isShow2=true, landmarkPois2=[]){



    var arrPois=[];
    // 实例化一个驾车导航用来生成路线
    var drv = new BMapGL.DrivingRoute('西藏', {
        onSearchComplete: function(res) {
            if (drv.getStatus() == BMAP_STATUS_SUCCESS) {
                var plan = res.getPlan(0);
                for(var j=0;j<plan.getNumRoutes();j++){
                    //var route = plan.getRoute(j);
                    arrPois= arrPois.concat(plan.getRoute(j).getPath());
                }
                map.addOverlay(new BMapGL.Polyline(arrPois, {strokeColor: strokeColor2,'strokeWeight': strokeWeight2}));
                if(isShow2){
                    map.setViewport(arrPois);
                }

                //postion和isShow默认传false，驾车线路不从route方法生成
                return route(icon2, speed2, false, strokeColor2, strokeWeight2, defaultContent2, false, landmarkPois2, arrPois);
             }
        }
    });

    //查找驾车线路
    var start=new BMapGL.Point(position2["begin_lng"],position2["begin_lat"]); //起点坐标
    var end=new BMapGL.Point(position2["end_lng"], position2["end_lat"]);  //终点坐标
    drv.search(start, end);
}


var cat = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADcAAAAgCAYAAAC2COBlAAAC10lEQVRYR+1Yz2sTQRR+01AxsSSYRgy2lWCqIjTagiRIL+lBUEFbC/4H9lRT8JRrjtZjUvTgUa/G6MEevOTSQzxYGwNW24C02kZIW1L6A5Qy8g1u2CS73V3d3SjsQGDYebPvfe/73pvZsHvzL1IdjF3jRDH6d8dTIpbLDI5mjYTIEgu5V8TpppFN7bBlnB6lh8Ymjfhmifc5bmRDG23zmcGxESP+HXBGsmWhrcOcPLm6ZHm2K0Bahfltv0b7Bz9ViYv5T4u1wubKn5JrDXPpS6OkFrzb1Uk9bh9lynO0tFNVDXwqPEywfb5WarBBQvBuHcNacHsKzHgMgOvvCrRgWN6pUro8pwMbWQcOctr8sdcShP+IhyA5Pcxhs04gSmCtAQdJSQNg8EPG5QNyk8sLUh0/NVA36XX7xPxrkwSRFJ3DXHBoJP3Huht8S0wpMbm8u1GvO+xNhIdp9vsnxdi7Oz0U9ffR1MJLndhMlqUAp1AnatGATampSODUgtdaV/BhLnOSA8hSC2QzCCl4tRrrPeql8Z5I+5iTg1va3aDZymJLQtUYkJ5raa5tsvxb5rAfMsX5hvMM9Yo5Gg/maDLF2roWfmndGlkikOsnz1N2rSSCxKEudbmIN0jF7UpL90xduEqFrVURfPJcnJKl1wQ274aiYg5gaDhaR4gMubng0M7jgTPiHPtQq1C+WhbXMNQggsKhPhIIU8QXFKDRGdFFUUux432U+vhGPJ8euCESgzX5HHYXvUGa/pw/9Or2G6D54BB8YWtFyAvBACxk9eTL2/qhDqnFT4TFczAFO3ROSXIToRgVt9frwEUiKotCohOhKD1bnVe8IDTp1VxweovBJjsHnDzRuj55bGJGy43DXCNz/8m/X5zzhzNDt5Na9DaAm3yXveJyddznnO4Y2WirLWeP2QF7kL58y9BnPLM1SJudOeBsTrhp7hzmTEulzS9ymLM54aa5+wV2TJcwUz5FeQAAAABJRU5ErkJggg==";
var fly = 'data:image/png;base64,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';

var car = "data:image/png;base64,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";


var ufo = "data:image/png;base64,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";


