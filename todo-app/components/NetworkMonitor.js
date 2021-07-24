import React, { useState, useEffect } from 'react';
import { getAllTasks, deleteTask } from '../services/ToDoService'
import { PingDelayService, LocaltionService,ReLocationService } from '../services/NetworkMonitorService'

function NetworkMonitor(){

  const [pingDelay, setPingDelay] = useState([])
  const [localtion, setLocaltion] = useState([])


  /**
   * 网络延迟检测，通过ping服务端的一个固定接口，计算连接所花时间（ms）
   * q1:现在是计算的是连接一次所花时间（ms）,是否需要都连接几次求个平均值呢？
   * q2:如果网络有问题，那返回值就一直没有，此方法就一直没有结果，是否需要设置一个超时时间？例如10s,超过时间就直接返回无网络？
   */
  function PingDelay(){
    Location()//先以这种方式调用获取地理位置的方法，可以研究下一个按钮绑定多个点击事件的做法
    let beginTime=new Date().getTime(); 
    PingDelayService().then(res=>{
      let consumeTime=res-beginTime;
      console.log(consumeTime)
      setPingDelay(consumeTime)
    })

  }

  /**
   * 通过访问系统服务端固定接口/ping,然后由服务端返回其IP所对应的大致地理位置
   * 官方文档说只能获得中国的40%~50%的ip地址......
   */
  function Location(){
    LocaltionService().then(res=> {
      console.log(res)
      setLocaltion(res)
    });
  }

  /**
   * 留有“纠错功能”。用户点击纠错会触发申请地理位置访问权限，获取真实地理位置,使用的是
   * 值得注意的是，此方法对http请求无效，对https请求有效
   */
  function ReLocation(){
    if(navigator.geolocation){
      console.log('可以获取地理位置')
      navigator.geolocation.getCurrentPosition(geoSuccess,geoError,detailPosition)
    }else{
        console.log('不可以请求地理权限')
    }
  }
  /**
   * 成功获取地理位置的回调
   * @param {} event 
   */
  function geoSuccess(event){
    const location = `纬度:`+event.coords.latitude + ', ' +`经度:`+ event.coords.longitude
    console.log(location)
    //通过调用api将经纬度转换成具体的地理位置
    LaLotitudeToLocation(event.coords.latitude,event.coords.longitude).then(res=>{
      setLocaltion(res)
    })
    // setLocaltion(location)
  }
  /**
   * 获取失败的回调
   * @param {} error 
   */
  function geoError(error){
    console.log("Error code " + error.code + ". " + error.message);
    switch (error.code) {
      case error.PERMISSION_DENIED:
        alert("定位失败,没有获取地理位置的权限");
        break;
      case error.POSITION_UNAVAILABLE:
        alert("定位失败,位置信息是不可用");
        break;
      case error.TIMEOUT:
        alert("定位失败,请求获取用户位置超时");
        break;
      case error.UNKNOWN_ERROR:
        alert("定位失败,定位系统出错");
        break;
    }
  }

  return(
    <div>
      <button onClick={PingDelay}>开始检测</button>
      <div>
        <label>网络延迟:<span>  {pingDelay}</span>ms</label>
        </div>
      <div>
        <label>地理位置:<span>  {localtion}</span><button onClick={ReLocation}>信息有误？重新校验</button></label>
      </div>
    </div>
  )

}
export default NetworkMonitor;