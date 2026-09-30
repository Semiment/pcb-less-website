/* 品牌数据 —— 由 build_brands_data.js 依 brands-src.json 生成，勿手工编辑
   款数与系列全部由 catalog-data.js 实算，未做任何人工填充或估算。
   hasLogo=false 时页面回退为纯 CSS 文字 LOGO；hasData=false 的品牌不出系列区，绝不编型号。 */
window.BRANDS = [
  {
    "slug": "semiment",
    "cn": "赛卓电子",
    "en": "Semiment",
    "ja": "セイジュオ電子",
    "de": "Semiment",
    "site": "https://www.semiment.com",
    "tagline": {
      "zh": "磁传感、电机驱动与车规电源管理芯片",
      "en": "Magnetic sensing, motor driver and automotive power ICs",
      "ja": "磁気センシング、モータードライバ、車載電源管理 IC",
      "de": "Magnetsensorik, Motortreiber und Automotive-Power-ICs"
    },
    "scope": {
      "zh": "",
      "en": "",
      "ja": "",
      "de": ""
    },
    "logo": "images/brands/semiment.svg",
    "hasLogo": false,
    "hasData": true,
    "parts": 137,
    "lines": [
      "sensors",
      "power"
    ],
    "series": [
      {
        "name": "开关霍尔",
        "count": 49
      },
      {
        "name": "速度传感器",
        "count": 26
      },
      {
        "name": "线性霍尔",
        "count": 25
      },
      {
        "name": "电机编码器",
        "count": 11
      },
      {
        "name": "角度传感器",
        "count": 11
      },
      {
        "name": "电流与保护",
        "count": 4
      },
      {
        "name": "开关转换器DC/DC",
        "count": 4
      },
      {
        "name": "升降压控制器DC/DC",
        "count": 3
      },
      {
        "name": "升压/降压控制器DC/DC",
        "count": 2
      },
      {
        "name": "多路输出DC/DC",
        "count": 1
      },
      {
        "name": "线性稳压器LDO",
        "count": 1
      }
    ],
    "pending": []
  },
  {
    "slug": "enpower",
    "cn": "英能科技",
    "en": "Enpower Micro",
    "ja": "インノン科技",
    "de": "Enpower Micro",
    "site": "https://enpowermicro.com",
    "tagline": {
      "zh": "电机驱动与功率器件",
      "en": "Motor drivers and power devices",
      "ja": "モータードライバとパワーデバイス",
      "de": "Motortreiber und Leistungsbauelemente"
    },
    "scope": {
      "zh": "",
      "en": "",
      "ja": "",
      "de": ""
    },
    "logo": "images/brands/enpower.svg",
    "hasLogo": false,
    "hasData": true,
    "parts": 42,
    "lines": [
      "motor"
    ],
    "series": [
      {
        "name": "功率器件 · MOSFET",
        "count": 18
      },
      {
        "name": "智能 ASIC 驱动",
        "count": 12
      },
      {
        "name": "驱动器 / 预驱",
        "count": 10
      },
      {
        "name": "车规产品",
        "count": 1
      },
      {
        "name": "电机驱动 MCU",
        "count": 1
      }
    ],
    "pending": [
      "品牌中文/英文正式名待老板确认",
      "是否并入赛卓体系展示待定"
    ]
  }
];
