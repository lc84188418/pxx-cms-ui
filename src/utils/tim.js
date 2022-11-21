import TIM from 'tim-js-sdk/tim-js-friendship.js'
import TIMUploadPlugin from 'tim-upload-plugin'
// 发送图片、文件等消息需要的 COS SDK
// import COS from "cos-js-sdk-v5"
import {_baseurl} from '@/utils/baseUrl'

// let responseObj,responseData;
// let xhr = new XMLHttpRequest(); // 创建XMLHttpRequest 实例
// xhr.open("get", `${_baseurl}/im/common/getSdk`, false); //设置为同步get请求
// xhr.send(null); // 开始发送请求，并且阻塞后续代码执行，直到拿到响应
// if((xhr.status >=200 && xhr.status <300) || xhr.status == 304){
// 	console.log("原生请求",xhr.responseText) // 检验状态码
// 	responseObj = JSON.parse(xhr.responseText)
// 	console.log("responseObjresponseObj",responseObj)
// 	if(responseObj.status === 'success'){
// 		responseData = responseObj.data
// 	}
// }else{
// 	console.log('请求失败')
// }


// 抛出userSig
export function GET_TIM_SIG(userID) {
	
	var EXPIRETIME = 604800;
	// var generator = new window.LibGenerateTestUserSig(responseData.sdkAppId, responseData.secretKey, EXPIRETIME);
	var generator = new window.LibGenerateTestUserSig('1400666760', '153b522a7030be323e08ae697a7d7cb1df94cc4342fa478a8692933e1699a031', EXPIRETIME);
	var userSig = generator.genTestUserSig(userID);
	return userSig;
}

// 抛出sdkAppId
export function GET_TIM_SDKAPPID(){
	// return responseData.sdkAppId
	return '1400666760'
}

// 初始化 SDK 实例
const tim = TIM.create({
//   SDKAppID: responseData.sdkAppId
  SDKAppID: '1400666760'
})

window.setLogLevel = tim.setLogLevel

// 无日志级别
tim.setLogLevel(4)

// 注册 cos
tim.registerPlugin({ 'tim-upload-plugin':TIMUploadPlugin })
// tim.registerPlugin({'cos-js-sdk': COS})
export default tim
