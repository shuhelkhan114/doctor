//
//  Doximity.m
//  Doc Hello
//
//  Created by Suhel on 14/04/2023.
//

#import <Foundation/Foundation.h>

#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(DocHelloDoximityDialer, NSObject);
RCT_EXTERN_METHOD(openDoximityDialer:(NSString *)phone)
@end
