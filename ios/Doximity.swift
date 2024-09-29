//
//  Doximity.swift
//  Doc Hello
//
//  Created by Suhel on 14/04/2023.
//

import Foundation

@objc(DocHelloDoximityDialer)
class DocHelloDoximityDialer: NSObject {
  @objc
  func openDoximityDialer(_ phoneNumber: String) -> Void  {
    DoxDialerCaller.shared().dialPhoneNumber(phoneNumber);
  }
  @objc
  static func requiresMainQueueSetup() -> Bool {
      return true
  }
}
