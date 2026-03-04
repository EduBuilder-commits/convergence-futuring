"use strict";(()=>{var e={};e.id=652,e.ids=[652],e.modules={30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},23475:(e,t,r)=>{r.r(t),r.d(t,{headerHooks:()=>m,originalPathname:()=>g,patchFetch:()=>y,requestAsyncStorage:()=>d,routeModule:()=>u,serverHooks:()=>p,staticGenerationAsyncStorage:()=>h,staticGenerationBailout:()=>f});var n={};r.r(n),r.d(n,{POST:()=>c});var i=r(95419),a=r(69108),o=r(99678),s=r(78070);let l=process.env.ANTHROPIC_API_KEY||"sk-ant-placeholder";async function c(e){try{let{type:t,data:r}=await e.json(),n="";switch(t){case"scenario_analysis":n=`You are a strategic futuring expert analyzing scenarios for educational district planning.

Analyze the following scenarios and provide:
1. Risk assessment for each scenario (1-100)
2. Probability of occurrence (%)
3. Key driving factors
4. Recommended actions
5. Early warning indicators to monitor

Scenarios:
${JSON.stringify(r.scenarios,null,2)}

Provide a detailed analysis in JSON format with the following structure:
{
  "analyses": [
    {
      "scenario": "scenario name",
      "riskScore": 1-100,
      "probability": 0-100,
      "drivingFactors": ["factor1", "factor2"],
      "recommendedActions": ["action1", "action2"],
      "earlyWarnings": ["warning1", "warning2"],
      "timeline": "short/medium/long term",
      "equityImpact": "high/medium/low",
      "affectedStakeholders": ["stakeholder1"]
    }
  ],
  "crossScenarioInsights": "key insights across all scenarios",
  "priorityActions": ["top 3 actions to take"]
}`;case"monte_carlo_analysis":n=`You are a Monte Carlo simulation expert analyzing probabilistic outcomes.

Analyze the following simulation results and provide:
1. Interpretation of the probability distribution
2. Key insights about uncertainty
3. Risk assessment
4. Recommendations for decision-making
5. What drives the variance

Simulation Results:
- Mean: ${r.mean}
- Median: ${r.median}
- Std Dev: ${r.stdDev}
- P10: ${r.p10}
- P90: ${r.p90}
- Iterations: ${r.iterations}

Variables:
${JSON.stringify(r.variables,null,2)}

Question: ${r.question}

Provide analysis in JSON:
{
  "interpretation": "what the results mean in plain language",
  "confidence": "high/medium/low",
  "keyInsights": ["insight1", "insight2"],
  "decisionGuidance": "how to use these results for decisions",
  "riskFactors": ["factor1", "factor2"],
  "recommendedScenario": "conservative/moderate/optimistic",
  "equityConsiderations": "any equity implications"
}`;case"stakeholder_analysis":n=`You are a stakeholder analysis expert for strategic planning.

Analyze the following stakeholders and provide:
1. Power/Interest grid positioning
2. Engagement strategy recommendations
3. Key concerns for each stakeholder
4. Potential coalition partners
5. Resistance factors

Stakeholders:
${JSON.stringify(r.stakeholders,null,2)}

Provide analysis in JSON:
{
  "stakeholderPositions": [
    {
      "name": "stakeholder name",
      "power": "high/medium/low",
      "interest": "high/medium/low",
      "position": "grid quadrant",
      "engagementStrategy": "how to engage",
      "keyConcerns": ["concern1"],
      "potentialSupport": "high/medium/low",
      "resistanceRisk": "high/medium/low"
    }
  ],
  "coalitions": ["potential coalitions"],
  "recommendedActions": ["priority actions"],
  "communicationPlan": "key messages by stakeholder"
}`;case"trend_analysis":n=`You are a data analyst specializing in historical trends and forecasting.

Analyze the following historical data and provide:
1. Trend interpretation
2. Seasonality patterns
3. Growth/decline assessment
4. Forecast for next periods
5. Anomaly detection

Historical Data:
${JSON.stringify(r.historical,null,2)}

Provide analysis in JSON:
{
  "trendSummary": "overall trend description",
  "growthRate": "percentage growth/decline",
  "seasonality": "any seasonal patterns",
  "anomalies": ["any detected anomalies"],
  "forecast": {
    "nextPeriod": "predicted value",
    "confidence": "high/medium/low",
    "range": { "low": X, "high": Y }
  },
  "equityGaps": "any disparities by subgroup",
  "recommendations": ["actions to take"]
}`;case"future_wheel":n=`You are a futures thinking expert using the Future Wheel methodology.

Analyze the following trend/force and map its impacts:
1. First-order impacts (direct)
2. Second-order impacts (indirect)
3. Third-order impacts (ripple effects)
4. Interconnections between impacts
5. Critical uncertainties

Trend/Force: ${r.trend}
Context: ${r.context}

Provide analysis in JSON:
{
  "center": "the central trend/force",
  "firstOrder": [
    { "impact": "direct impact", "type": "positive/negative/neutral" }
  ],
  "secondOrder": [
    { "impact": "indirect impact", "linkedTo": "first order impact" }
  ],
  "thirdOrder": [
    { "impact": "ripple effect", "linkedTo": "second order" }
  ],
  "interconnections": ["key connections between impacts"],
  "criticalUncertainties": ["most uncertain outcomes"],
  "strategicImplications": "what this means for planning"
}`;case"cross_impact":n=`You are an expert in Cross-Impact Analysis for strategic planning.

Analyze the following forces and their interdependencies:
1. How each force impacts others
2. Feedback loops
3. System behaviors
4. Leverage points
5. Tipping points

Forces:
${JSON.stringify(r.forces,null,2)}

Provide analysis in JSON:
{
  "impacts": [
    {
      "from": "force A",
      "to": "force B",
      "strength": "strong/medium/weak",
      "direction": "positive/negative",
      "timeline": "short/medium/long"
    }
  ],
  "feedbackLoops": ["identified loops"],
  "leveragePoints": ["best intervention points"],
  "tippingPoints": ["potential triggers"],
  "systemDynamics": "overall system behavior",
  "strategicRecommendations": ["priority actions"]
}`;case"equity_projection":n=`You are an equity-centered data analyst for educational planning.

Analyze the following subgroup data and provide:
1. Achievement gap identification
2. Disparity trends
3. Equity-focused projections
4. Targeted intervention recommendations
5. Resource allocation guidance

Data by Subgroup:
${JSON.stringify(r.subgroups,null,2)}

District Context: ${r.context}

Provide analysis in JSON:
{
  "gaps": [
    {
      "metric": "metric name",
      "subgroupVsDistrict": "percentage difference",
      "trend": "improving/worsening/stable",
      "significance": "high/medium/low"
    }
  ],
  "projections": {
    "ifNoAction": "predicted outcome",
    "withIntervention": "predicted outcome",
    "timeline": "by when"
  },
  "interventions": [
    {
      "target": "subgroup or gap",
      "approach": "recommended approach",
      "expectedImpact": "percentage improvement"
    }
  ],
  "resourceNeeds": "estimated requirements",
  "equityScore": "1-100 score"
}`;default:return s.Z.json({error:"Unknown analysis type"},{status:400})}let i=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":l,"anthropic-version":"2023-06-01"},body:JSON.stringify({model:"claude-3-5-sonnet-20241022",max_tokens:4e3,messages:[{role:"user",content:n}]})});if(!i.ok){let e=await i.text();return console.error("Anthropic API error:",e),s.Z.json({mock:!0,message:"Using demo analysis",type:t,analysis:function(e){switch(e){case"scenario_analysis":return{analyses:[{scenario:"Baseline",riskScore:35,probability:45,recommendedActions:["Continue current strategy"]},{scenario:"Transformation",riskScore:25,probability:30,recommendedActions:["Prepare for digital shift"]},{scenario:"Constraint",riskScore:55,probability:20,recommendedActions:["Build reserves","Diversify funding"]}],priorityActions:["Monitor key indicators","Build strategic reserves"]};case"monte_carlo_analysis":return{interpretation:"Results show moderate uncertainty with 80% confidence interval",confidence:"medium",keyInsights:["Main driver is enrollment change","Budget variance is within acceptable range"],decisionGuidance:"Plan for conservative scenario while watching leading indicators"};default:return{message:"Demo analysis available"}}}(t)})}let a=(await i.json()).content[0].text;try{let e=JSON.parse(a);return s.Z.json(e)}catch{return s.Z.json({text:a,raw:!0})}}catch(e){return console.error("API error:",e),s.Z.json({error:"Analysis failed",details:e instanceof Error?e.message:"Unknown error"},{status:500})}}let u=new i.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/api/analyze/route",pathname:"/api/analyze",filename:"route",bundlePath:"app/api/analyze/route"},resolvedPagePath:"C:\\Users\\OpenClaw\\.openclaw\\workspace\\simdistrict-new\\src\\app\\api\\analyze\\route.ts",nextConfigOutput:"",userland:n}),{requestAsyncStorage:d,staticGenerationAsyncStorage:h,serverHooks:p,headerHooks:m,staticGenerationBailout:f}=u,g="/api/analyze/route";function y(){return(0,o.patchFetch)({serverHooks:p,staticGenerationAsyncStorage:h})}},97347:e=>{var t=Object.defineProperty,r=Object.getOwnPropertyDescriptor,n=Object.getOwnPropertyNames,i=Object.prototype.hasOwnProperty,a={};function o(e){var t;let r=["path"in e&&e.path&&`Path=${e.path}`,"expires"in e&&(e.expires||0===e.expires)&&`Expires=${("number"==typeof e.expires?new Date(e.expires):e.expires).toUTCString()}`,"maxAge"in e&&"number"==typeof e.maxAge&&`Max-Age=${e.maxAge}`,"domain"in e&&e.domain&&`Domain=${e.domain}`,"secure"in e&&e.secure&&"Secure","httpOnly"in e&&e.httpOnly&&"HttpOnly","sameSite"in e&&e.sameSite&&`SameSite=${e.sameSite}`,"priority"in e&&e.priority&&`Priority=${e.priority}`].filter(Boolean);return`${e.name}=${encodeURIComponent(null!=(t=e.value)?t:"")}; ${r.join("; ")}`}function s(e){let t=new Map;for(let r of e.split(/; */)){if(!r)continue;let e=r.indexOf("=");if(-1===e){t.set(r,"true");continue}let[n,i]=[r.slice(0,e),r.slice(e+1)];try{t.set(n,decodeURIComponent(null!=i?i:"true"))}catch{}}return t}function l(e){var t,r;if(!e)return;let[[n,i],...a]=s(e),{domain:o,expires:l,httponly:d,maxage:h,path:p,samesite:m,secure:f,priority:g}=Object.fromEntries(a.map(([e,t])=>[e.toLowerCase(),t]));return function(e){let t={};for(let r in e)e[r]&&(t[r]=e[r]);return t}({name:n,value:decodeURIComponent(i),domain:o,...l&&{expires:new Date(l)},...d&&{httpOnly:!0},..."string"==typeof h&&{maxAge:Number(h)},path:p,...m&&{sameSite:c.includes(t=(t=m).toLowerCase())?t:void 0},...f&&{secure:!0},...g&&{priority:u.includes(r=(r=g).toLowerCase())?r:void 0}})}((e,r)=>{for(var n in r)t(e,n,{get:r[n],enumerable:!0})})(a,{RequestCookies:()=>d,ResponseCookies:()=>h,parseCookie:()=>s,parseSetCookie:()=>l,stringifyCookie:()=>o}),e.exports=((e,a,o,s)=>{if(a&&"object"==typeof a||"function"==typeof a)for(let o of n(a))i.call(e,o)||void 0===o||t(e,o,{get:()=>a[o],enumerable:!(s=r(a,o))||s.enumerable});return e})(t({},"__esModule",{value:!0}),a);var c=["strict","lax","none"],u=["low","medium","high"],d=class{constructor(e){this._parsed=new Map,this._headers=e;let t=e.get("cookie");if(t)for(let[e,r]of s(t))this._parsed.set(e,{name:e,value:r})}[Symbol.iterator](){return this._parsed[Symbol.iterator]()}get size(){return this._parsed.size}get(...e){let t="string"==typeof e[0]?e[0]:e[0].name;return this._parsed.get(t)}getAll(...e){var t;let r=Array.from(this._parsed);if(!e.length)return r.map(([e,t])=>t);let n="string"==typeof e[0]?e[0]:null==(t=e[0])?void 0:t.name;return r.filter(([e])=>e===n).map(([e,t])=>t)}has(e){return this._parsed.has(e)}set(...e){let[t,r]=1===e.length?[e[0].name,e[0].value]:e,n=this._parsed;return n.set(t,{name:t,value:r}),this._headers.set("cookie",Array.from(n).map(([e,t])=>o(t)).join("; ")),this}delete(e){let t=this._parsed,r=Array.isArray(e)?e.map(e=>t.delete(e)):t.delete(e);return this._headers.set("cookie",Array.from(t).map(([e,t])=>o(t)).join("; ")),r}clear(){return this.delete(Array.from(this._parsed.keys())),this}[Symbol.for("edge-runtime.inspect.custom")](){return`RequestCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`}toString(){return[...this._parsed.values()].map(e=>`${e.name}=${encodeURIComponent(e.value)}`).join("; ")}},h=class{constructor(e){var t,r,n;this._parsed=new Map,this._headers=e;let i=null!=(n=null!=(r=null==(t=e.getSetCookie)?void 0:t.call(e))?r:e.get("set-cookie"))?n:[];for(let e of Array.isArray(i)?i:function(e){if(!e)return[];var t,r,n,i,a,o=[],s=0;function l(){for(;s<e.length&&/\s/.test(e.charAt(s));)s+=1;return s<e.length}for(;s<e.length;){for(t=s,a=!1;l();)if(","===(r=e.charAt(s))){for(n=s,s+=1,l(),i=s;s<e.length&&"="!==(r=e.charAt(s))&&";"!==r&&","!==r;)s+=1;s<e.length&&"="===e.charAt(s)?(a=!0,s=i,o.push(e.substring(t,n)),t=s):s=n+1}else s+=1;(!a||s>=e.length)&&o.push(e.substring(t,e.length))}return o}(i)){let t=l(e);t&&this._parsed.set(t.name,t)}}get(...e){let t="string"==typeof e[0]?e[0]:e[0].name;return this._parsed.get(t)}getAll(...e){var t;let r=Array.from(this._parsed.values());if(!e.length)return r;let n="string"==typeof e[0]?e[0]:null==(t=e[0])?void 0:t.name;return r.filter(e=>e.name===n)}has(e){return this._parsed.has(e)}set(...e){let[t,r,n]=1===e.length?[e[0].name,e[0].value,e[0]]:e,i=this._parsed;return i.set(t,function(e={name:"",value:""}){return"number"==typeof e.expires&&(e.expires=new Date(e.expires)),e.maxAge&&(e.expires=new Date(Date.now()+1e3*e.maxAge)),(null===e.path||void 0===e.path)&&(e.path="/"),e}({name:t,value:r,...n})),function(e,t){for(let[,r]of(t.delete("set-cookie"),e)){let e=o(r);t.append("set-cookie",e)}}(i,this._headers),this}delete(...e){let[t,r,n]="string"==typeof e[0]?[e[0]]:[e[0].name,e[0].path,e[0].domain];return this.set({name:t,path:r,domain:n,value:"",expires:new Date(0)})}[Symbol.for("edge-runtime.inspect.custom")](){return`ResponseCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`}toString(){return[...this._parsed.values()].map(o).join("; ")}}},95419:(e,t,r)=>{e.exports=r(30517)},78070:(e,t,r)=>{Object.defineProperty(t,"Z",{enumerable:!0,get:function(){return n.NextResponse}});let n=r(70457)},10514:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"NextURL",{enumerable:!0,get:function(){return u}});let n=r(737),i=r(65418),a=r(40283),o=r(23588),s=/(?!^https?:\/\/)(127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|\[::1\]|localhost)/;function l(e,t){return new URL(String(e).replace(s,"localhost"),t&&String(t).replace(s,"localhost"))}let c=Symbol("NextURLInternal");class u{constructor(e,t,r){let n,i;"object"==typeof t&&"pathname"in t||"string"==typeof t?(n=t,i=r||{}):i=r||t||{},this[c]={url:l(e,n??i.base),options:i,basePath:""},this.analyze()}analyze(){var e,t,r,i,s;let l=(0,o.getNextPathnameInfo)(this[c].url.pathname,{nextConfig:this[c].options.nextConfig,parseData:!0,i18nProvider:this[c].options.i18nProvider}),u=(0,a.getHostname)(this[c].url,this[c].options.headers);this[c].domainLocale=this[c].options.i18nProvider?this[c].options.i18nProvider.detectDomainLocale(u):(0,n.detectDomainLocale)(null==(t=this[c].options.nextConfig)?void 0:null==(e=t.i18n)?void 0:e.domains,u);let d=(null==(r=this[c].domainLocale)?void 0:r.defaultLocale)||(null==(s=this[c].options.nextConfig)?void 0:null==(i=s.i18n)?void 0:i.defaultLocale);this[c].url.pathname=l.pathname,this[c].defaultLocale=d,this[c].basePath=l.basePath??"",this[c].buildId=l.buildId,this[c].locale=l.locale??d,this[c].trailingSlash=l.trailingSlash}formatPathname(){return(0,i.formatNextPathnameInfo)({basePath:this[c].basePath,buildId:this[c].buildId,defaultLocale:this[c].options.forceLocale?void 0:this[c].defaultLocale,locale:this[c].locale,pathname:this[c].url.pathname,trailingSlash:this[c].trailingSlash})}formatSearch(){return this[c].url.search}get buildId(){return this[c].buildId}set buildId(e){this[c].buildId=e}get locale(){return this[c].locale??""}set locale(e){var t,r;if(!this[c].locale||!(null==(r=this[c].options.nextConfig)?void 0:null==(t=r.i18n)?void 0:t.locales.includes(e)))throw TypeError(`The NextURL configuration includes no locale "${e}"`);this[c].locale=e}get defaultLocale(){return this[c].defaultLocale}get domainLocale(){return this[c].domainLocale}get searchParams(){return this[c].url.searchParams}get host(){return this[c].url.host}set host(e){this[c].url.host=e}get hostname(){return this[c].url.hostname}set hostname(e){this[c].url.hostname=e}get port(){return this[c].url.port}set port(e){this[c].url.port=e}get protocol(){return this[c].url.protocol}set protocol(e){this[c].url.protocol=e}get href(){let e=this.formatPathname(),t=this.formatSearch();return`${this.protocol}//${this.host}${e}${t}${this.hash}`}set href(e){this[c].url=l(e),this.analyze()}get origin(){return this[c].url.origin}get pathname(){return this[c].url.pathname}set pathname(e){this[c].url.pathname=e}get hash(){return this[c].url.hash}set hash(e){this[c].url.hash=e}get search(){return this[c].url.search}set search(e){this[c].url.search=e}get password(){return this[c].url.password}set password(e){this[c].url.password=e}get username(){return this[c].url.username}set username(e){this[c].url.username=e}get basePath(){return this[c].basePath}set basePath(e){this[c].basePath=e.startsWith("/")?e:`/${e}`}toString(){return this.href}toJSON(){return this.href}[Symbol.for("edge-runtime.inspect.custom")](){return{href:this.href,origin:this.origin,protocol:this.protocol,username:this.username,password:this.password,host:this.host,hostname:this.hostname,port:this.port,pathname:this.pathname,search:this.search,searchParams:this.searchParams,hash:this.hash}}clone(){return new u(String(this),this[c].options)}}},63608:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var r in t)Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}(t,{RequestCookies:function(){return n.RequestCookies},ResponseCookies:function(){return n.ResponseCookies}});let n=r(97347)},70457:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"NextResponse",{enumerable:!0,get:function(){return c}});let n=r(10514),i=r(68670),a=r(63608),o=Symbol("internal response"),s=new Set([301,302,303,307,308]);function l(e,t){var r;if(null==e?void 0:null==(r=e.request)?void 0:r.headers){if(!(e.request.headers instanceof Headers))throw Error("request.headers must be an instance of Headers");let r=[];for(let[n,i]of e.request.headers)t.set("x-middleware-request-"+n,i),r.push(n);t.set("x-middleware-override-headers",r.join(","))}}class c extends Response{constructor(e,t={}){super(e,t),this[o]={cookies:new a.ResponseCookies(this.headers),url:t.url?new n.NextURL(t.url,{headers:(0,i.toNodeOutgoingHttpHeaders)(this.headers),nextConfig:t.nextConfig}):void 0}}[Symbol.for("edge-runtime.inspect.custom")](){return{cookies:this.cookies,url:this.url,body:this.body,bodyUsed:this.bodyUsed,headers:Object.fromEntries(this.headers),ok:this.ok,redirected:this.redirected,status:this.status,statusText:this.statusText,type:this.type}}get cookies(){return this[o].cookies}static json(e,t){let r=Response.json(e,t);return new c(r.body,r)}static redirect(e,t){let r="number"==typeof t?t:(null==t?void 0:t.status)??307;if(!s.has(r))throw RangeError('Failed to execute "redirect" on "response": Invalid status code');let n="object"==typeof t?t:{},a=new Headers(null==n?void 0:n.headers);return a.set("Location",(0,i.validateURL)(e)),new c(null,{...n,headers:a,status:r})}static rewrite(e,t){let r=new Headers(null==t?void 0:t.headers);return r.set("x-middleware-rewrite",(0,i.validateURL)(e)),l(t,r),new c(null,{...t,headers:r})}static next(e){let t=new Headers(null==e?void 0:e.headers);return t.set("x-middleware-next","1"),l(e,t),new c(null,{...e,headers:t})}}},68670:(e,t)=>{function r(e){let t=new Headers;for(let[r,n]of Object.entries(e))for(let e of Array.isArray(n)?n:[n])void 0!==e&&("number"==typeof e&&(e=e.toString()),t.append(r,e));return t}function n(e){var t,r,n,i,a,o=[],s=0;function l(){for(;s<e.length&&/\s/.test(e.charAt(s));)s+=1;return s<e.length}for(;s<e.length;){for(t=s,a=!1;l();)if(","===(r=e.charAt(s))){for(n=s,s+=1,l(),i=s;s<e.length&&"="!==(r=e.charAt(s))&&";"!==r&&","!==r;)s+=1;s<e.length&&"="===e.charAt(s)?(a=!0,s=i,o.push(e.substring(t,n)),t=s):s=n+1}else s+=1;(!a||s>=e.length)&&o.push(e.substring(t,e.length))}return o}function i(e){let t={},r=[];if(e)for(let[i,a]of e.entries())"set-cookie"===i.toLowerCase()?(r.push(...n(a)),t[i]=1===r.length?r[0]:r):t[i]=a;return t}function a(e){try{return String(new URL(String(e)))}catch(t){throw Error(`URL is malformed "${String(e)}". Please use only absolute URLs - https://nextjs.org/docs/messages/middleware-relative-urls`,{cause:t})}}Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var r in t)Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}(t,{fromNodeOutgoingHttpHeaders:function(){return r},splitCookiesString:function(){return n},toNodeOutgoingHttpHeaders:function(){return i},validateURL:function(){return a}})},40283:(e,t)=>{function r(e,t){let r;if((null==t?void 0:t.host)&&!Array.isArray(t.host))r=t.host.toString().split(":",1)[0];else{if(!e.hostname)return;r=e.hostname}return r.toLowerCase()}Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"getHostname",{enumerable:!0,get:function(){return r}})},737:(e,t)=>{function r(e,t,r){if(e)for(let a of(r&&(r=r.toLowerCase()),e)){var n,i;if(t===(null==(n=a.domain)?void 0:n.split(":",1)[0].toLowerCase())||r===a.defaultLocale.toLowerCase()||(null==(i=a.locales)?void 0:i.some(e=>e.toLowerCase()===r)))return a}}Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"detectDomainLocale",{enumerable:!0,get:function(){return r}})},73935:(e,t)=>{function r(e,t){let r;let n=e.split("/");return(t||[]).some(t=>!!n[1]&&n[1].toLowerCase()===t.toLowerCase()&&(r=t,n.splice(1,1),e=n.join("/")||"/",!0)),{pathname:e,detectedLocale:r}}Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"normalizeLocalePath",{enumerable:!0,get:function(){return r}})},28030:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"addLocale",{enumerable:!0,get:function(){return a}});let n=r(23495),i=r(67211);function a(e,t,r,a){if(!t||t===r)return e;let o=e.toLowerCase();return!a&&((0,i.pathHasPrefix)(o,"/api")||(0,i.pathHasPrefix)(o,"/"+t.toLowerCase()))?e:(0,n.addPathPrefix)(e,"/"+t)}},23495:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"addPathPrefix",{enumerable:!0,get:function(){return i}});let n=r(81955);function i(e,t){if(!e.startsWith("/")||!t)return e;let{pathname:r,query:i,hash:a}=(0,n.parsePath)(e);return""+t+r+i+a}},2348:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"addPathSuffix",{enumerable:!0,get:function(){return i}});let n=r(81955);function i(e,t){if(!e.startsWith("/")||!t)return e;let{pathname:r,query:i,hash:a}=(0,n.parsePath)(e);return""+r+t+i+a}},65418:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"formatNextPathnameInfo",{enumerable:!0,get:function(){return s}});let n=r(5545),i=r(23495),a=r(2348),o=r(28030);function s(e){let t=(0,o.addLocale)(e.pathname,e.locale,e.buildId?void 0:e.defaultLocale,e.ignorePrefix);return(e.buildId||!e.trailingSlash)&&(t=(0,n.removeTrailingSlash)(t)),e.buildId&&(t=(0,a.addPathSuffix)((0,i.addPathPrefix)(t,"/_next/data/"+e.buildId),"/"===e.pathname?"index.json":".json")),t=(0,i.addPathPrefix)(t,e.basePath),!e.buildId&&e.trailingSlash?t.endsWith("/")?t:(0,a.addPathSuffix)(t,"/"):(0,n.removeTrailingSlash)(t)}},23588:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"getNextPathnameInfo",{enumerable:!0,get:function(){return o}});let n=r(73935),i=r(37188),a=r(67211);function o(e,t){var r,o;let{basePath:s,i18n:l,trailingSlash:c}=null!=(r=t.nextConfig)?r:{},u={pathname:e,trailingSlash:"/"!==e?e.endsWith("/"):c};s&&(0,a.pathHasPrefix)(u.pathname,s)&&(u.pathname=(0,i.removePathPrefix)(u.pathname,s),u.basePath=s);let d=u.pathname;if(u.pathname.startsWith("/_next/data/")&&u.pathname.endsWith(".json")){let e=u.pathname.replace(/^\/_next\/data\//,"").replace(/\.json$/,"").split("/"),r=e[0];u.buildId=r,d="index"!==e[1]?"/"+e.slice(1).join("/"):"/",!0===t.parseData&&(u.pathname=d)}if(l){let e=t.i18nProvider?t.i18nProvider.analyze(u.pathname):(0,n.normalizeLocalePath)(u.pathname,l.locales);u.locale=e.detectedLocale,u.pathname=null!=(o=e.pathname)?o:u.pathname,!e.detectedLocale&&u.buildId&&(e=t.i18nProvider?t.i18nProvider.analyze(d):(0,n.normalizeLocalePath)(d,l.locales)).detectedLocale&&(u.locale=e.detectedLocale)}return u}},81955:(e,t)=>{function r(e){let t=e.indexOf("#"),r=e.indexOf("?"),n=r>-1&&(t<0||r<t);return n||t>-1?{pathname:e.substring(0,n?r:t),query:n?e.substring(r,t>-1?t:void 0):"",hash:t>-1?e.slice(t):""}:{pathname:e,query:"",hash:""}}Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"parsePath",{enumerable:!0,get:function(){return r}})},67211:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"pathHasPrefix",{enumerable:!0,get:function(){return i}});let n=r(81955);function i(e,t){if("string"!=typeof e)return!1;let{pathname:r}=(0,n.parsePath)(e);return r===t||r.startsWith(t+"/")}},37188:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"removePathPrefix",{enumerable:!0,get:function(){return i}});let n=r(67211);function i(e,t){if(!(0,n.pathHasPrefix)(e,t))return e;let r=e.slice(t.length);return r.startsWith("/")?r:"/"+r}},5545:(e,t)=>{function r(e){return e.replace(/\/$/,"")||"/"}Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"removeTrailingSlash",{enumerable:!0,get:function(){return r}})}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),n=t.X(0,[638],()=>r(23475));module.exports=n})();