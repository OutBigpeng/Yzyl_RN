////
////  RNPhoneManager.m
////  YouZhong
////
////  Created by coatu on 16/9/9.
////  Copyright © 2016年 Facebook. All rights reserved.
////
//
//#import "RNPhoneManager.h"
//#import "RCTBridge.h"
//@implementation RNPhoneManager
//
//RCT_EXPORT_MODULE()
//
//RCT_EXPORT_METHOD(findEvents:(RCTResponseSenderBlock)callback)
//{
//  NSString *phoneStr=@"tel:021-2357-1211";
//  phoneStr=[phoneStr stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
//  NSURL *phoneUrl=[NSURL URLWithString:phoneStr];
//
//  if([[UIApplication sharedApplication] canOpenURL:phoneUrl]){
//    [[UIApplication sharedApplication] openURL:phoneUrl];
//  }
//  callback(@[[NSNull null]]);
//}
//
//- (dispatch_queue_t)methodQueue
//{
//  return dispatch_get_main_queue();
//}
//@end
