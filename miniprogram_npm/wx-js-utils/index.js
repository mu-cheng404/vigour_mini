module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1628672649948, function(require, module, exports) {
const {
    WXPay,
    WXPayUtil,
    WXPayConstants
} = require('./libs/WXPay');
const WXUniformMessage = require('./libs/WXUniformMessage');
const WXMINIMessage = require('./libs/WXMINIMessage');
const WXMINIUser = require('./libs/WXMINIUser');
const WXMINIQR = require('./libs/WXMINIQR');
const WXMINIActMessage = require('./libs/WXMINIActMessage');


module.exports = {
    WXPay,
    WXPayUtil,
    WXPayConstants,
    WXMINIMessage,
    WXUniformMessage,
    WXMINIUser,
    WXMINIQR,
    WXMINIActMessage
};
}, function(modId) {var map = {"./libs/WXPay":1628672649949,"./libs/WXUniformMessage":1628672649950,"./libs/WXMINIMessage":1628672649952,"./libs/WXMINIUser":1628672649953,"./libs/WXMINIQR":1628672649954,"./libs/WXMINIActMessage":1628672649955}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1628672649949, function(require, module, exports) {
let request = require('request');
let Md5     = require('md5');
let xml2js  = require('xml2js');
let uuid    = require('uuid');
let crypto = require('crypto');

let _DEFAULT_TIMEOUT = 10 * 1000; // ms

let WXPayConstants = {

    // SUCCESS, FAIL
    SUCCESS: 'SUCCESS',
    FAIL: 'FAIL',

    // 签名类型
    SIGN_TYPE_HMACSHA256: 'HMAC-SHA256',
    SIGN_TYPE_MD5: 'MD5',

    // 字段
    FIELD_SIGN: 'sign',
    FIELD_SIGN_TYPE: 'sign_type',

    // URL
    MICROPAY_URL: 'https://api.mch.weixin.qq.com/pay/micropay',
    UNIFIEDORDER_URL: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
    ORDERQUERY_URL: 'https://api.mch.weixin.qq.com/pay/orderquery',
    REVERSE_URL: 'https://api.mch.weixin.qq.com/secapi/pay/reverse',
    CLOSEORDER_URL: 'https://api.mch.weixin.qq.com/pay/closeorder',
    REFUND_URL: 'https://api.mch.weixin.qq.com/secapi/pay/refund',
    REFUNDQUERY_URL: 'https://api.mch.weixin.qq.com/pay/refundquery',
    DOWNLOADBILL_URL: 'https://api.mch.weixin.qq.com/pay/downloadbill',
    REPORT_URL: 'https://api.mch.weixin.qq.com/payitil/report',
    SHORTURL_URL: 'https://api.mch.weixin.qq.com/tools/shorturl',
    AUTHCODETOOPENID_URL: 'https://api.mch.weixin.qq.com/tools/authcodetoopenid',

    // Sandbox URL
    SANDBOX_MICROPAY_URL: 'https://api.mch.weixin.qq.com/sandboxnew/pay/micropay',
    SANDBOX_UNIFIEDORDER_URL: 'https://api.mch.weixin.qq.com/sandboxnew/pay/unifiedorder',
    SANDBOX_ORDERQUERY_URL: 'https://api.mch.weixin.qq.com/sandboxnew/pay/orderquery',
    SANDBOX_REVERSE_URL: 'https://api.mch.weixin.qq.com/sandboxnew/secapi/pay/reverse',
    SANDBOX_CLOSEORDER_URL: 'https://api.mch.weixin.qq.com/sandboxnew/pay/closeorder',
    SANDBOX_REFUND_URL: 'https://api.mch.weixin.qq.com/sandboxnew/secapi/pay/refund',
    SANDBOX_REFUNDQUERY_URL: 'https://api.mch.weixin.qq.com/sandboxnew/pay/refundquery',
    SANDBOX_DOWNLOADBILL_URL: 'https://api.mch.weixin.qq.com/sandboxnew/pay/downloadbill',
    SANDBOX_REPORT_URL: 'https://api.mch.weixin.qq.com/sandboxnew/payitil/report',
    SANDBOX_SHORTURL_URL: 'https://api.mch.weixin.qq.com/sandboxnew/tools/shorturl',
    SANDBOX_AUTHCODETOOPENID_URL: 'https://api.mch.weixin.qq.com/sandboxnew/tools/authcodetoopenid',

};

const WXPayUtil = {

    /**
   * XML 字符串转换成 object
   *
   * @param {string} xmlStr
   * @returns {Promise}
   */
    xml2obj: function (xmlStr) {
        return new Promise(function(resolve, reject) {
            let parseString = xml2js.parseString;
            parseString(xmlStr, function (err, result) {
                if (err) {
                    reject(err);
                }
                else {
                    let data = result['xml'];
                    let newData = {};
                    Object.keys(data).forEach(function(key, idx) {
                        if (data[key].length > 0) { newData[key] = data[key][0] }
                    });
                    resolve(newData);
                }
            });
        });
    },

    /**
   * object 转换成 XML 字符串
   *
   * @param {object} obj
   * @returns {Promise}
   */
    obj2xml: function (obj) {
        return new Promise(function (resolve, reject) {
            let builder = new xml2js.Builder({ cdata: true, rootName: 'xml' });
            try {
                let xmlStr = builder.buildObject(obj);
                resolve(xmlStr);
            } catch (err) {
                reject(err);
            }
        });
    },

    /**
   * 生成签名
   *
   * @param {object} data
   * @param {string} key API key
   * @param {string} signTypeParam
   * @returns {string}
   */
    generateSignature: function (data, key, signTypeParam) {
        let signType = signTypeParam || WXPayConstants.SIGN_TYPE_MD5;
        if (signType !== WXPayConstants.SIGN_TYPE_MD5 && signType !== WXPayConstants.SIGN_TYPE_HMACSHA256) {
            throw new Error('Invalid signType: ' + signType);
        }
        let combineStr = '';
        let ks = Object.keys(data).sort();
        for (let i = 0; i < ks.length; ++i) {
            let k = ks[i];
            if (k !== WXPayConstants.FIELD_SIGN && data[k]) {
                let v = String(data[k]);
                if (v.length > 0) {
                    combineStr = combineStr + k + '=' + v + '&';
                }
            }
        }
        if (combineStr.length === 0) {
            throw new Error('There is no data to generate signature');
        }
        else {
            combineStr = combineStr + 'key=' + key;
            if (signType === WXPayConstants.SIGN_TYPE_MD5) {
                return this.md5(combineStr);
            }
            else if (signType === WXPayConstants.SIGN_TYPE_HMACSHA256) {
                return this.hmacsha256(combineStr, key);
            }
            else {
                throw new Error('Invalid signType: ' + signType);
            }
        }
    },

    /**
   * 验证签名
   *
   * @param {object} data
   * @param {string} key API key
   * @param {string} signTypeParam
   * @returns {boolean}
   */
    isSignatureValid: function (data, key, signTypeParam) {
        let signType = signTypeParam || WXPayConstants.SIGN_TYPE_MD5;
        if (data === null || typeof data !== 'object') {
            return false;
        }
        else if (!data[WXPayConstants.FIELD_SIGN]) {
            return false;
        }
        else {
            return data[WXPayConstants.FIELD_SIGN] === this.generateSignature(data, key, signType);
        }
    },

    /**
   * 带有签名的 XML 数据
   *
   * @param {object} data
   * @param {string} key
   * @param {string} signType
   * @returns {Promise}
   */
    generateSignedXml: function (data, key, signType) {
        let clonedDataObj = JSON.parse(JSON.stringify(data));
        clonedDataObj[WXPayConstants.FIELD_SIGN] = this.generateSignature(data, key, signType);
        return new Promise(function (resolve, reject) {
            WXPayUtil.obj2xml(clonedDataObj)
                .then(function (xmlStr) {
                    resolve(xmlStr);
                }).catch(function (err) {
                    reject(err);
                });
        });
    },

    /**
   * 生成随机字符串
   *
   * @returns {string}
   */
    generateNonceStr: function () {
        return uuid.v4().replace(/\-/g, '');
    },

    /**
   * 得到 MD5 签名结果
   *
   * @param {string} source
   * @returns {string}
   */
    md5: function (source) {
        return Md5(source).toUpperCase();
    },

    /**
   * 得到 HMAC-SHA256 签名结果
   *
   * @param {string} source
   * @param {string} key
   * @returns {string}
   */
    hmacsha256: function (source, key) {
        return crypto.createHmac('sha256', key).update(source, 'utf8').digest('hex').toUpperCase();
    }

};

/**
 * WXPay对象
 *
 * @param {object} config
 * @constructor
 */
let WXPay = function (config) {
    if (!(this instanceof WXPay)) {
        throw new TypeError('Please use \'new WXPay\'');
    }
    // let options = ['appId', 'mchId', 'key', 'certFileContent', 'caFileContent'];
    let options = ['appId', 'mchId', 'key'];
    for (let i = 0; i < options.length; ++i) {
        if (!config[options[i]]) {
            throw new Error('Please check ' + options[i] + ' in config');
        }
    }

    this.APPID = config['appId'];
    this.MCHID = config['mchId'];
    this.KEY = config['key'];
    this.CERT_FILE_CONTENT = config['certFileContent'];
    this.CA_FILE_CONTENT = config['caFileContent'];

    this.TIMEOUT = config['timeout'] || _DEFAULT_TIMEOUT;
    this.SIGN_TYPE = config['signType'] || WXPayConstants.SIGN_TYPE_MD5;
    this.USE_SANDBOX = config['useSandbox'] || false;
};

/**
 * 处理 HTTP 请求的返回信息（主要是做签名验证），并将 xml 转换为 object
 *
 * @param {string} respXml
 * @returns {Promise}
 */
WXPay.prototype.processResponseXml = function(respXml) {
    let self = this;

    return new Promise(function (resolve, reject) {
        WXPayUtil.xml2obj(respXml).then(function (respObj) {
            let return_code = respObj['return_code'];
            if (return_code) {
                if (return_code === WXPayConstants.FAIL) {
                    resolve(respObj);
                }
                else if (return_code === WXPayConstants.SUCCESS) {
                    let isValid = self.isResponseSignatureValid(respObj);
                    if (isValid) {
                        resolve(respObj);
                    }
                    else {
                        reject(new Error('Invalid sign value in XML: ' + respXml));
                    }
                }
                else {
                    reject(new Error('Invalid return_code in XML: ' + respXml));
                }
            }
            else {
                reject(new Error('no return_code in the response XML: ' + respXml));
            }
        }).catch(function (err) {
            reject(err);
        });
    });
};


/**
 * 请求响应中的签名是否合法
 *
 * @param {object} respData
 * @returns {boolean}
 */
WXPay.prototype.isResponseSignatureValid = function(respData) {
    return WXPayUtil.isSignatureValid(respData, this.KEY, this.SIGN_TYPE);
};

/**
 * 判断支付结果通知中的sign是否有效。必须有sign字段
 *
 * @param {object} notifyData
 * @returns {boolean}
 */
WXPay.prototype.isPayResultNotifySignatureValid = function(notifyData) {
    let signType;
    let signTypeInData = notifyData[WXPayConstants.FIELD_SIGN_TYPE];
    if (!signTypeInData) {
        signType = WXPayConstants.SIGN_TYPE_MD5;
    }
    else {
        signTypeInData = (String(signTypeInData)).trim();
        if (signTypeInData.length === 0) {
            signType = WXPayConstants.SIGN_TYPE_MD5;
        }
        else if (signTypeInData === WXPayConstants.SIGN_TYPE_MD5) {
            signType = WXPayConstants.SIGN_TYPE_MD5;
        }
        else if (signTypeInData === WXPayConstants.SIGN_TYPE_HMACSHA256) {
            signType = WXPayConstants.SIGN_TYPE_HMACSHA256;
        }
        else {
            throw new Error('Invalid sign_type: ' + signTypeInData + ' in pay result notify');
        }
    }
    return WXPayUtil.isSignatureValid(notifyData, this.KEY, signType);

};

/**
 * 向数据中添加appid、mch_id、nonce_str、sign_type、sign
 *
 * @param {object} reqData
 * @returns {object}
 */
WXPay.prototype.fillRequestData = function (reqData) {
    let self = this;
    let clonedData = JSON.parse(JSON.stringify(reqData));
    clonedData['appid'] = self.APPID;
    clonedData['mch_id'] = self.MCHID;
    clonedData['nonce_str'] = WXPayUtil.generateNonceStr();
    clonedData[WXPayConstants.FIELD_SIGN_TYPE] = self.SIGN_TYPE;
    clonedData[WXPayConstants.FIELD_SIGN] = WXPayUtil.generateSignature(clonedData, self.KEY, self.SIGN_TYPE);
    return clonedData;
};

/**
 * HTTP(S) 请求，无证书
 *
 * @param {string} url
 * @param {object} reqData
 * @param {int} timeout
 * @returns {Promise}
 */
WXPay.prototype.requestWithoutCert = function(url, reqData, timeout) {
    let self = this;
    return new Promise(function(resolve, reject) {
        let options = {
            url: url,
            timeout: timeout || self.TIMEOUT
        };
        WXPayUtil.obj2xml(reqData).then(function (reqXml) {
            // console.log('reqXml', reqXml);
            options['body'] = reqXml;
            request.post(options, function(error, response, body) {
                if (error) {
                    reject(error);
                } else {
                    // console.log('resp: ', body);
                    resolve(body);
                }
            });
        }).catch(function (err) {
            reject(err);
        });
    });
};

/**
 * HTTP(S)请求，附带证书，适合申请退款等接口
 *
 * @param {string} url
 * @param {object} reqData
 * @param {int} timeout
 * @returns {Promise}
 */
WXPay.prototype.requestWithCert = function(url, reqData, timeout) {
    let self = this;
    return new Promise(function(resolve, reject) {
        let options = {
            url: url,
            timeout: timeout || self.TIMEOUT,
            agentOptions: {
                ca: self.CA_FILE_CONTENT,
                pfx: self.CERT_FILE_CONTENT,
                passphrase: self.MCHID
            }
        };
        WXPayUtil.obj2xml(reqData).then(function (reqXml) {
            options['body'] = reqXml;
            request.post(options, function(error, response, body) {
                if (error) {
                    reject(error);
                } else {
                    resolve(body);
                }
            });
        }).catch(function (err) {
            reject(err);
        });
    });
};

/**
 * 提交刷卡支付
 *
 * @param {object} reqData
 * @param {int} timeout
 * @returns {Promise}
 */
WXPay.prototype.microPay = function (reqData, timeout) {
    let self = this;
    let url = WXPayConstants.MICROPAY_URL;
    if (self.USE_SANDBOX) {
        url = WXPayConstants.SANDBOX_MICROPAY_URL;
    }
    return new Promise(function (resolve, reject) {
        self.requestWithoutCert(url, self.fillRequestData(reqData), timeout).then(function (respXml) {
            self.processResponseXml(respXml).then(function (respObj) {
                resolve(respObj);
            }).catch(function (err) {
                reject(err);
            });
        }).catch(function (err) {
            reject(err);
        });
    });
};

/**
 * 统一下单
 *
 * @param {object} reqData
 * @param {int} timeout
 * @returns {Promise}
 */
WXPay.prototype.unifiedOrder = function (reqData, timeout) {
    let self = this;
    let url = WXPayConstants.UNIFIEDORDER_URL;
    if (self.USE_SANDBOX) {
        url = WXPayConstants.SANDBOX_UNIFIEDORDER_URL;
    }
    return new Promise(function (resolve, reject) {
        self.requestWithoutCert(url, self.fillRequestData(reqData), timeout).then(function (respXml) {
            self.processResponseXml(respXml).then(function (respObj) {
                resolve(respObj);
            }).catch(function (err) {
                reject(err);
            });
        }).catch(function (err) {
            reject(err);
        });
    });
};

/**
 * 查询订单
 *
 * @param {object} reqData
 * @param {int} timeout
 * @returns {Promise}
 */
WXPay.prototype.orderQuery = function (reqData, timeout) {
    let self = this;
    let url = WXPayConstants.ORDERQUERY_URL;
    if (self.USE_SANDBOX) {
        url = WXPayConstants.SANDBOX_ORDERQUERY_URL;
    }
    return new Promise(function (resolve, reject) {
        self.requestWithoutCert(url, self.fillRequestData(reqData), timeout).then(function (respXml) {
            self.processResponseXml(respXml).then(function (respObj) {
                resolve(respObj);
            }).catch(function (err) {
                reject(err);
            });
        }).catch(function (err) {
            reject(err);
        });
    });
};

/**
 * 撤销订单, 用于刷卡支付
 *
 * @param {object} reqData
 * @param {int} timeout
 * @returns {Promise}
 */
WXPay.prototype.reverse = function (reqData, timeout) {
    let self = this;
    let url = WXPayConstants.REVERSE_URL;
    if (self.USE_SANDBOX) {
        url = WXPayConstants.SANDBOX_REVERSE_URL;
    }
    return new Promise(function (resolve, reject) {
        self.requestWithCert(url, self.fillRequestData(reqData), timeout).then(function (respXml) {
            self.processResponseXml(respXml).then(function (respObj) {
                resolve(respObj);
            }).catch(function (err) {
                reject(err);
            });
        }).catch(function (err) {
            reject(err);
        });
    });
};


/**
 * 关闭订单
 *
 * @param {object} reqData
 * @param {int} timeout
 * @returns {Promise}
 */
WXPay.prototype.closeOrder = function (reqData, timeout) {
    let self = this;
    let url = WXPayConstants.CLOSEORDER_URL;
    if (self.USE_SANDBOX) {
        url = WXPayConstants.SANDBOX_CLOSEORDER_URL;
    }
    return new Promise(function (resolve, reject) {
        self.requestWithoutCert(url, self.fillRequestData(reqData), timeout).then(function (respXml) {
            self.processResponseXml(respXml).then(function (respObj) {
                resolve(respObj);
            }).catch(function (err) {
                reject(err);
            });
        }).catch(function (err) {
            reject(err);
        });
    });
};


/**
 * 申请退款
 *
 * @param {object} reqData
 * @param {int} timeout
 * @returns {Promise}
 */
WXPay.prototype.refund = function (reqData, timeout) {
    let self = this;
    let url = WXPayConstants.REFUND_URL;
    if (self.USE_SANDBOX) {
        url = WXPayConstants.SANDBOX_REFUND_URL;
    }
    return new Promise(function (resolve, reject) {
        self.requestWithCert(url, self.fillRequestData(reqData), timeout).then(function (respXml) {
            self.processResponseXml(respXml).then(function (respObj) {
                resolve(respObj);
            }).catch(function (err) {
                reject(err);
            });
        }).catch(function (err) {
            reject(err);
        });
    });
};


/**
 * 退款查询
 *
 * @param {object} reqData
 * @param {int} timeout
 * @returns {Promise}
 */
WXPay.prototype.refundQuery = function (reqData, timeout) {
    let self = this;
    let url = WXPayConstants.REFUNDQUERY_URL;
    if (self.USE_SANDBOX) {
        url = WXPayConstants.SANDBOX_REFUNDQUERY_URL;
    }
    return new Promise(function (resolve, reject) {
        self.requestWithoutCert(url, self.fillRequestData(reqData), timeout).then(function (respXml) {
            self.processResponseXml(respXml).then(function (respObj) {
                resolve(respObj);
            }).catch(function (err) {
                reject(err);
            });
        }).catch(function (err) {
            reject(err);
        });
    });
};

/**
 * 下载对账单
 *
 * @param {object} reqData
 * @param {int} timeout
 * @returns {Promise}
 */
WXPay.prototype.downloadBill = function (reqData, timeout) {
    let self = this;
    let url = WXPayConstants.DOWNLOADBILL_URL;
    if (self.USE_SANDBOX) {
        url = WXPayConstants.SANDBOX_DOWNLOADBILL_URL;
    }
    return new Promise(function (resolve, reject) {
        self.requestWithoutCert(url, self.fillRequestData(reqData), timeout).then(function (respStrParam) {
            let respStr = respStrParam.trim();
            if (respStr.startsWith('<')) {  // XML格式，下载出错
                self.processResponseXml(respStr).then(function (respObj) {
                    resolve(respObj);
                }).catch(function (err) {
                    reject(err);
                });
            }
            else {   // 下载到数据了
                resolve({
                    return_code: 'SUCCESS',
                    return_msg: '',
                    data: respStr
                });
            }
        }).catch(function (err) {
            reject(err);
        });
    });
};

/**
 * 交易保障
 *
 * @param {object} reqData
 * @param {int} timeout
 * @returns {Promise}
 */
WXPay.prototype.report = function (reqData, timeout) {
    let self = this;
    let url = WXPayConstants.REPORT_URL;
    if (self.USE_SANDBOX) {
        url = WXPayConstants.SANDBOX_REPORT_URL;
    }
    return new Promise(function (resolve, reject) {
        self.requestWithoutCert(url, self.fillRequestData(reqData), timeout).then(function (respXml) {
            WXPayUtil.xml2obj(respXml).then(function (respObj) {
                resolve(respObj);
            }).catch(function (err) {
                reject(err);
            });
        }).catch(function (err) {
            reject(err);
        });
    });
};

/**
 * 转换短链接
 *
 * @param {object} reqData
 * @param {int} timeout
 * @returns {Promise}
 */
WXPay.prototype.shortUrl = function (reqData, timeout) {
    let self = this;
    let url = WXPayConstants.SHORTURL_URL;
    if (self.USE_SANDBOX) {
        url = WXPayConstants.SANDBOX_SHORTURL_URL;
    }
    return new Promise(function (resolve, reject) {
        self.requestWithoutCert(url, self.fillRequestData(reqData), timeout).then(function (respXml) {
            self.processResponseXml(respXml).then(function (respObj) {
                resolve(respObj);
            }).catch(function (err) {
                reject(err);
            });
        }).catch(function (err) {
            reject(err);
        });
    });
};

/**
 * 授权码查询 OPENID 接口
 *
 * @param {object} reqData
 * @param {int} timeout
 * @returns {Promise}
 */
WXPay.prototype.authCodeToOpenid = function (reqData, timeout) {
    let self = this;
    let url = WXPayConstants.AUTHCODETOOPENID_URL;
    if (self.USE_SANDBOX) {
        url = WXPayConstants.SANDBOX_AUTHCODETOOPENID_URL;
    }
    return new Promise(function (resolve, reject) {
        self.requestWithoutCert(url, self.fillRequestData(reqData), timeout).then(function (respXml) {
            self.processResponseXml(respXml).then(function (respObj) {
                resolve(respObj);
            }).catch(function (err) {
                reject(err);
            });
        }).catch(function (err) {
            reject(err);
        });
    });
};

module.exports = {
    WXPayConstants: WXPayConstants,
    WXPayUtil: WXPayUtil,
    WXPay: WXPay
};
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1628672649950, function(require, module, exports) {
const {
    rp
} = require('./utils');

class WXUniformMessage {
    /**
     * 发送统一服务消息
     * @param {String} access_token 接口调用凭证
     * @param {String} touser 用户openid，可以是小程序的openid，也可以是mp_template_msg.appid对应的公众号的openid
     * @param {Object} weapp_template_msg 小程序模板消息相关的信息
     * @param {String} weapp_template_msg.template_id 小程序模板ID
     * @param {String} weapp_template_msg.form_id 小程序模板消息formid
     * @param {Object} weapp_template_msg.data 小程序模板数据
     * @param {String} weapp_template_msg.page 小程序页面路径
     * @param {String} weapp_template_msg.emphasis_keyword  小程序模板放大关键词
     * @param {Object} mp_template_msg  公众号模板消息相关的信息
     * @param {String} mp_template_msg.appid 公众号appid，要求与小程序有绑定且同主体
     * @param {String} mp_template_msg.template_id 公众号模板id
     * @param {String} mp_template_msg.url 公众号模板消息所要跳转的url
     * @param {Object} mp_template_msg.miniprogram 公众号模板消息所要跳转的小程序，小程序的必须与公众号具有绑定关系
     * @param {String} mp_template_msg.miniprogram.appid 小程序appId
     * @param {String} mp_template_msg.miniprogram.pagepath 小程序页面路径
     * @param {Object} mp_template_msg.data 公众号模板消息的数据
     * 具体参数名称参见官网 https://developers.weixin.qq.com/miniprogram/dev/api/open-api/uniform-message/sendUniformMessage.html
     */
    async sendMessage({
        access_token,
        touser,
        weapp_template_msg,
        mp_template_msg
    }) {
        let url = `https://api.weixin.qq.com/cgi-bin/message/wxopen/template/uniform_send?access_token=${access_token}`;

        let postData = {
            touser
        };

        if (weapp_template_msg) {
            postData = Object.assign(postData, { weapp_template_msg })
        }
        if (mp_template_msg) {
            postData = Object.assign(postData, { mp_template_msg })
        }

        const msg = await rp({
            url: url,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        });

        return JSON.parse(msg.body);
    }
}

module.exports = WXUniformMessage;
}, function(modId) { var map = {"./utils":1628672649951}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1628672649951, function(require, module, exports) {
const request = require('request');

/**
 * 发送请求
 * @param {Object} options 请求参数
 */
const rp = options =>
    new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (error) {
                reject(error);
            }
            resolve(response);
        });
    });

module.exports = {
    rp // request promise
};
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1628672649952, function(require, module, exports) {
const {
    rp
} = require('./utils');

class WXMINIMessage {

    async sendMessage({
        touser,
        template_id,
        form_id,
        access_token,
        data,
        page,
        emphasis_keyword
    }) {
        let url = `https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=${access_token}`;

        let postData = {
            touser,
            template_id,
            form_id,
            data,
            page,
            emphasis_keyword
        };

        const msg = await rp({
            url: url,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        });

        return JSON.parse(msg.body);
    }
}

module.exports = WXMINIMessage;
}, function(modId) { var map = {"./utils":1628672649951}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1628672649953, function(require, module, exports) {
const {
    rp
} = require('./utils');

const cloud = require('tcb-admin-node');

class WXMINIUser {

    constructor({ appId, secret }) {
        this.appId = appId;
        this.secret = secret;
    }

    // 获取 access_token 并缓存
    async getCacheAccessToken(options = {}) {
        let {
            env = null,
            secretId = null,
            secretKey = null,
            collection = 'access_token',
            gapTime = 300000 // 5 分钟
        } = options;

        cloud.init({
            secretId,
            secretKey,
            env
        });

        let db = cloud.database();
        let result = await db.collection(collection).get();

        if (result.code) {
            return null;
        }

        // 没有缓存，获取
        if (!result.data.length) {
            let accessTokenBody = await this.getAccessToken(false);
            // console.log(accessTokenBody);
            await db.collection(collection).add({
                accessToken: accessTokenBody.access_token,
                expiresIn: accessTokenBody.expires_in * 1000,
                createTime: Date.now()
            });
            return accessTokenBody.access_token;
        }
        else {
            let data = result.data[0];
            let {
                _id,
                accessToken,
                expiresIn,
                createTime
            } = data;
            
            // access_token 依然有效
            if (Date.now() < createTime + expiresIn - gapTime) {
                return accessToken;
            }
            // 失效，重新拉取
            else {
                let accessTokenBody = await this.getAccessToken(false);
                await db.collection(collection).doc(_id).set({
                    accessToken: accessTokenBody.access_token,
                    expiresIn: accessTokenBody.expires_in * 1000,
                    createTime: Date.now()
                });
                return accessTokenBody.access_token;
            }
        }
    }

    // 获取 access_token
    async getAccessToken(isTokenOnly = true) {
        const result = await rp({
            url: `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appId=${this.appId}&secret=${this.secret}`,
            method: 'GET'
        });

        if (result.code || result.errcode || !result.body) {
            throw new Error({
                msg: 'failed to get access_token',
                detail: result
            });
        }

        let rbody = (typeof result.body === 'object') ? result.body : JSON.parse(result.body);
        return isTokenOnly ? rbody.access_token : rbody;
    }

    // 获取 openid  和 session_key
    async codeToSession(code) {
        const result = await rp({
            url: `https://api.weixin.qq.com/sns/jscode2session?appId=${this.appId}&secret=${this.secret}&js_code=${code}&grant_type=authorization_code`,
            method: 'GET'
        });

        try {
            return JSON.parse(result.body);
        }
        catch (e) {
            throw e;
        }
    }
}

module.exports = WXMINIUser;
}, function(modId) { var map = {"./utils":1628672649951}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1628672649954, function(require, module, exports) {
const {
    rp
} = require('./utils');

class WXMINIQR {

    async getMiniQRLimit({
        access_token,
        path,
        width,
        auto_color,
        line_color,
        is_hyaline
    }) {
        let url = `https://api.weixin.qq.com/wxa/getwxacode?access_token=${access_token}`;

        let postData = {
            path,
            width,
            auto_color,
            line_color,
            is_hyaline
        };

        const msg = await rp({
            url: url,
            encoding: null,
            method: 'POST',
            body: JSON.stringify(postData)
        });

        return msg.body;
    }

    async getMiniQR({
        access_token,
        scene,
        page,
        width,
        auto_color,
        line_color,
        is_hyaline
    }) {
        let url = `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${access_token}`;

        let postData = {
            scene,
            page,
            width,
            auto_color,
            line_color,
            is_hyaline
        };

        const msg = await rp({
            url: url,
            encoding: null,
            method: 'POST',
            body: JSON.stringify(postData)
        });

        return msg.body;
    }

    async getQR({
        access_token,
        path,
        width
    }) {
        let url = `https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode?access_token=${access_token}`;

        let postData = {
            path,
            width
        };

        const msg = await rp({
            url: url,
            encoding: null,
            method: 'POST',
            body: JSON.stringify(postData)
        });

        return msg.body;
    }
}

module.exports = WXMINIQR;
}, function(modId) { var map = {"./utils":1628672649951}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1628672649955, function(require, module, exports) {
const {
    rp
} = require('./utils');

class WXMINIActMessage {

    async createActivityId(access_token) {
        let url = `https://api.weixin.qq.com/cgi-bin/message/wxopen/activityid/create?access_token=${access_token}`;

        const msg = await rp({
            url: url,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return JSON.parse(msg.body);
    }

    async setUpdatableMsg({
        access_token,
        activity_id,
        target_state,
        template_info
    }) {
        let url = `https://api.weixin.qq.com/cgi-bin/message/wxopen/updatablemsg/send?access_token=${access_token}`;

        let postData = {
            activity_id,
            target_state,
            template_info
        };

        const msg = await rp({
            url: url,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        });

        return JSON.parse(msg.body);
    }
}

module.exports = WXMINIActMessage;
}, function(modId) { var map = {"./utils":1628672649951}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1628672649948);
})()
//miniprogram-npm-outsideDeps=["request","md5","xml2js","uuid","crypto","tcb-admin-node"]
//# sourceMappingURL=index.js.map