import{k as D,j as e,a as q,b as te,c as re,d as se,g as _,o as ie,v as ce,w as A}from"./index-4gj2gAX5.js";import{r as g,e as d}from"./vendor-query-ID3LZdv4.js";import{t as le}from"./ted-mobile-logo-88-nSPA06aC.js";import{a as de}from"./usePhoneActions-DArv9Ytc.js";import{c as me}from"./index-BuWdQ9qZ.js";import{u as B}from"./index-QawpWmE2.js";import{u as pe,R as ue,T as he,c as fe,d as O,b as xe}from"./index-DDncJ8-K.js";import{C as be}from"./clock-BtMVb26D.js";import{C as ge}from"./check-circle-C7t5oAH5.js";import"./vendor-react-Cq0c0wkN.js";import"./vendor-convex-CcH70fqT.js";const ye=D("MapPin",[["path",{d:"M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z",key:"2oe9fu"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]]),ve=D("Navigation",[["polygon",{points:"3 11 22 2 13 21 11 13 3 11",key:"1ltx0t"}]]),we=D("Phone",[["path",{d:"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",key:"foiqr5"}]]);var Ae=g.createContext(void 0);function je(o){const t=g.useContext(Ae);return o||t||"ltr"}var u="Accordion",Ce=["Home","End","ArrowDown","ArrowUp","ArrowLeft","ArrowRight"],[F,Ne,Ie]=me(u),[C]=se(u,[Ie,O]),S=O(),V=d.forwardRef((o,t)=>{const{type:n,...r}=o,i=r,a=r;return e.jsx(F.Provider,{scope:o.__scopeAccordion,children:n==="multiple"?e.jsx(Te,{...a,ref:t}):e.jsx(Me,{...i,ref:t})})});V.displayName=u;var[U,ke]=C(u),[G,Pe]=C(u,{collapsible:!1}),Me=d.forwardRef((o,t)=>{const{value:n,defaultValue:r,onValueChange:i=()=>{},collapsible:a=!1,...l}=o,[c,m]=B({prop:n,defaultProp:r??"",onChange:i,caller:u});return e.jsx(U,{scope:o.__scopeAccordion,value:d.useMemo(()=>c?[c]:[],[c]),onItemOpen:m,onItemClose:d.useCallback(()=>a&&m(""),[a,m]),children:e.jsx(G,{scope:o.__scopeAccordion,collapsible:a,children:e.jsx(H,{...l,ref:t})})})}),Te=d.forwardRef((o,t)=>{const{value:n,defaultValue:r,onValueChange:i=()=>{},...a}=o,[l,c]=B({prop:n,defaultProp:r??[],onChange:i,caller:u}),m=d.useCallback(x=>c((h=[])=>[...h,x]),[c]),f=d.useCallback(x=>c((h=[])=>h.filter(v=>v!==x)),[c]);return e.jsx(U,{scope:o.__scopeAccordion,value:l,onItemOpen:m,onItemClose:f,children:e.jsx(G,{scope:o.__scopeAccordion,collapsible:!0,children:e.jsx(H,{...a,ref:t})})})}),[Ee,N]=C(u),H=d.forwardRef((o,t)=>{const{__scopeAccordion:n,disabled:r,dir:i,orientation:a="vertical",...l}=o,c=d.useRef(null),m=te(c,t),f=Ne(n),h=je(i)==="ltr",v=re(o.onKeyDown,y=>{if(!Ce.includes(y.key))return;const I=y.target,s=f().filter(E=>!E.ref.current?.disabled),p=s.findIndex(E=>E.ref.current===I),w=s.length;if(p===-1)return;y.preventDefault();let b=p;const k=0,P=w-1,M=()=>{b=p+1,b>P&&(b=k)},T=()=>{b=p-1,b<k&&(b=P)};switch(y.key){case"Home":b=k;break;case"End":b=P;break;case"ArrowRight":a==="horizontal"&&(h?M():T());break;case"ArrowDown":a==="vertical"&&M();break;case"ArrowLeft":a==="horizontal"&&(h?T():M());break;case"ArrowUp":a==="vertical"&&T();break}const ae=b%w;s[ae].ref.current?.focus()});return e.jsx(Ee,{scope:n,disabled:r,direction:i,orientation:a,children:e.jsx(F.Slot,{scope:n,children:e.jsx(q.div,{...l,"data-orientation":a,ref:m,onKeyDown:r?void 0:v})})})}),j="AccordionItem",[Re,W]=C(j),$=d.forwardRef((o,t)=>{const{__scopeAccordion:n,value:r,...i}=o,a=N(j,n),l=ke(j,n),c=S(n),m=pe(),f=r&&l.value.includes(r)||!1,x=a.disabled||o.disabled;return e.jsx(Re,{scope:n,open:f,disabled:x,triggerId:m,children:e.jsx(ue,{"data-orientation":a.orientation,"data-state":J(f),...c,...i,ref:t,disabled:x,open:f,onOpenChange:h=>{h?l.onItemOpen(r):l.onItemClose(r)}})})});$.displayName=j;var z="AccordionHeader",L=d.forwardRef((o,t)=>{const{__scopeAccordion:n,...r}=o,i=N(u,n),a=W(z,n);return e.jsx(q.h3,{"data-orientation":i.orientation,"data-state":J(a.open),"data-disabled":a.disabled?"":void 0,...r,ref:t})});L.displayName=z;var R="AccordionTrigger",Y=d.forwardRef((o,t)=>{const{__scopeAccordion:n,...r}=o,i=N(u,n),a=W(R,n),l=Pe(R,n),c=S(n);return e.jsx(F.ItemSlot,{scope:n,children:e.jsx(he,{"aria-disabled":a.open&&!l.collapsible||void 0,"data-orientation":i.orientation,id:a.triggerId,...c,...r,ref:t})})});Y.displayName=R;var K="AccordionContent",Z=d.forwardRef((o,t)=>{const{__scopeAccordion:n,...r}=o,i=N(u,n),a=W(K,n),l=S(n);return e.jsx(fe,{role:"region","aria-labelledby":a.triggerId,"data-orientation":i.orientation,...l,...r,ref:t,style:{"--radix-accordion-content-height":"var(--radix-collapsible-content-height)","--radix-accordion-content-width":"var(--radix-collapsible-content-width)",...o.style}})});Z.displayName=K;function J(o){return o?"open":"closed"}var De=V,_e=$,Fe=L,Q=Y,X=Z;const Se=De,ee=g.forwardRef(({className:o,...t},n)=>e.jsx(_e,{ref:n,className:_("border-b",o),...t}));ee.displayName="AccordionItem";const oe=g.forwardRef(({className:o,children:t,...n},r)=>e.jsx(Fe,{className:"flex",children:e.jsxs(Q,{ref:r,className:_("flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",o),...n,children:[t,e.jsx(xe,{className:"h-4 w-4 shrink-0 transition-transform duration-200"})]})}));oe.displayName=Q.displayName;const ne=g.forwardRef(({className:o,children:t,...n},r)=>e.jsx(X,{ref:r,className:"overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",...n,children:e.jsx("div",{className:_("pb-4 pt-0",o),children:t})}));ne.displayName=X.displayName;const We=[{id:"item-1",title:"📦 1 Year Warranty — What's Covered?",content:`All phones sold at Micky Mobile come with a 1-year warranty covering manufacturing defects, hardware failures, and battery issues.

• Covered: factory defects, hardware faults, battery degradation.
• NOT covered: cracked screens, water damage, physical misuse.

To make a claim, bring your receipt and the phone to our Addis Ababa store.`,contentAm:`📦 የ1 ዓመት ዋስትና — ምን ምን ያካትታል?

በMicky Mobile የሚሸጡ ሁሉም ስልኮች ከፋብሪካ የሚመጡ የቴክኒክ ጉድለቶችን፣ የሃርድዌር ብልሽቶችን እና የባትሪ ችግሮችን የሚሸፍን የ1 ዓመት ዋስትና አላቸው።

• የሚካተቱት፦ የፋብሪካ ጉድለቶች፣ የሃርድዌር ብልሽቶች፣ የባትሪ መበላሸት።
• የማይካተቱት፦ የተሰበረ ስክሪን፣ በውሃ የደረሰ ጉዳት፣ በአጠቃቀም ስህተት የሚመጡ ጉዳቶች።

አገልግሎቱን ለማግኘት፣ ደረሰኝዎን እና ስልኩን አዲስ አበባ በሚገኘው ሱቃችን ይዘው ይምጡ።`},{id:"item-2",title:"🔄 Return & Refund Policy",content:`Returns are accepted within 48 hours of purchase if the phone has a defect we missed.

• Phone must be in the same condition as sold — unused, no physical damage.
• Bring your original receipt.
• After 48 hours: no cash refunds. We offer store credit or an exchange.`,contentAm:`🔄 የእቃ መመለስ እና የገንዘብ ተመላሽ ፖሊሲ

ስልኩ እኛ ያላስተዋልነው የቴክኒክ ችግር (Defect) ካለበት፣ ከተገዛበት ቀን ጀምሮ በ48 ሰዓታት ውስጥ መመለስ ይቻላል።

• ስልኩ በተሸጠበት ሁኔታ መሆን አለበት — ጥቅም ላይ ያልዋለ እና ምንም አይነት የአካል ጉዳት (Physical damage) ያልደረሰበት።

• ዋናውን ደረሰኝ ይዘው ይምጡ።

• ከ48 ሰዓታት በኋላ፦ የጥሬ ገንዘብ ተመላሽ አይደረግም። በምትኩ በሱቃችን ሌላ እቃ መግዣ (Store credit) ወይም ሌላ ስልክ መቀየር እንችላለን።`},{id:"item-3",title:"🚚 Shipping & Delivery",content:`We deliver within Addis Ababa.

• Same-day pickup available at our store.
• Home delivery within 24 hours (fee varies by location).
• We partner with trusted local couriers.
• Prefer in-person? Visit us at Bole Alemnesh Plaza Ground Floor.`,contentAm:`አዲስ አበባ ውስጥ እናደርሳለን።

• በዕለቱ ከሱቃችን መረከብ (Pickup) ይቻላል።
• በ24 ሰዓት ውስጥ የቤት ለቤት አቅርቦት (የማድረሻ ክፍያ እንደ ቦታው ይለያያል)።
• ከታማኝ የሀገር ውስጥ መላላኪያዎች ጋር እንሰራለን።
• በአካል መገኘት ይመርጣሉ? Bole Alemnesh Plaza Ground Floor በሚገኘው Micky Mobile ሱቃችን ይጎብኙን።`},{id:"item-4",title:"🛡️ How We Verify Phones (Anti-Fraud)",content:`Every phone goes through strict verification before sale:

✔ IMEI checked — not blacklisted or reported stolen.
✔ Authentic hardware — no clone or counterfeit parts.
✔ iCloud / Google account unlocked — no activation lock.
✔ Full diagnostic test — camera, battery, screen, speakers.

Cloned or locked phones are never sold at Micky Mobile.`,contentAm:`🛡️ ስልኮችን የምናረጋግጥበት መንገድ (ከማጭበርበር የጸዳ)

እያንዳንዱ ስልክ ከመሸጡ በፊት ጥብቅ የማጣራት ሂደት ውስጥ ያልፋል፦

✔ IMEI ተፈትሿል፦ በጥቁር መዝገብ ላይ ያልሰፈረ ወይም የተሰረቀ ተብሎ ሪፖርት ያልተደረገበት።
✔ ኦሪጅናል ሃርድዌር፦ ምንም አይነት የተቀዳ (clone) ወይም አስመሳይ እቃ የሌለው።
✔ iCloud / Google አካውንት የተከፈተ፦ ምንም አይነት የኤክቲቬሽን መቆለፊያ (activation lock) የሌለው።
✔ ሙሉ የቴክኒክ ምርመራ፦ ካሜራ፣ ባትሪ፣ ስክሪን እና ስፒከር።

የተቀዱ (Clone) ወይም የተቆለፉ ስልኮች በMicky Mobile በፍፁም አይሸጡም።`},{id:"item-5",title:"⏱️ Exchange Process Timeline",content:`The entire exchange process typically takes under 1 hour:

1. Bring your phone — our team evaluates it (15–20 min).
2. Receive a fair offer based on model, condition, and storage.
3. Accept the offer and choose your new phone.
4. Pay any difference and leave with your upgrade — often same day.`,contentAm:`⏱️ የልውውጥ ሂደት የጊዜ ሰሌዳ

አጠቃላይ የልውውጥ ሂደቱ ብዙውን ጊዜ ከ1 ሰዓት በታች ይፈጃል፦

ስልክዎን ይዘው ይምጡ — የቡድናችን አባላት ይመረምሩታል (ከ15–20 ደቂቃ)።

እንደ ስልኩ ሞዴል፣ ሁኔታ እና የሜሞሪ መጠን (Storage) ተመጣጣኝ ዋጋ ይሰጥዎታል።

የቀረበልዎትን ዋጋ ሲቀበሉ አዲሱን ስልክዎን ይመርጣሉ።

የዋጋ ልዩነቱን በመክፈል አዲሱን ስልክዎን (Upgrade) ይዘው ይሄዳሉ — ይህም በአብዛኛው በዚያው ቀን ይጠናቀቃል።`},{id:"item-6",title:"📱 Is the Phone Box Included?",content:`Brand-new phones always come with the original box and full accessories.

For used/refurbished phones, original packaging varies — some include the box, some don't. Ask us about a specific phone before purchasing.`,contentAm:`📱 የስልኩ ካርቶን ይካተታል?

አዲስ (Brand-new) ስልኮች ሁልጊዜ ከዋናው ካርቶናቸው እና ከሙሉ መለዋወጫዎቻቸው (accessories) ጋር ይመጣሉ።

ለያገለገሉ ወይም እንደ አዲስ ለታደሱ (used/refurbished) ስልኮች፣ የማሸጊያው ሁኔታ ይለያያል — አንዳንዶቹ ካርቶን አላቸው፣ አንዳንዶቹ ደግሞ የላቸውም። ከመግዛትዎ በፊት ስለሚፈልጉት ስልክ በዝርዝር ይጠይቁን።`},{id:"item-7",title:"❓ Do You Buy / Accept Trade-Ins?",content:`Yes! We buy used phones and accept trade-ins.

• Bring your phone for a free evaluation (no commitment).
• We assess model, condition, and storage — you get an instant offer.
• Accept it as credit toward a new phone, or take cash.

Ready to exchange? Tap below to start:`,contentAm:`❓ ስልኮችን ትገዛላችሁ / በልውውጥ (Trade-In) ትቀበላላችሁ?

አዎ! ያገለገሉ ስልኮችን እንገዛለን እንዲሁም በልውውጥ እንቀበላለን።

• ያለምንም ግዴታ (no commitment) ለነፃ ግምገማ ስልክዎን ይዘው ይምጡ።
• የስልኩን ሞዴል፣ ሁኔታ እና የሜሞሪ መጠን (Storage) በማየት ወዲያውኑ ዋጋ እንሰጥዎታለን።
• የሰጠናችሁን ዋጋ ለአዲስ ስልክ መግዣ (Credit) መጠቀም ወይም በጥሬ ገንዘብ (Cash) መውሰድ ይችላሉ።

ለመለዋወጥ ዝግጁ ነዎት? ለመጀመር ከታች ይጫኑ፦`,hasExchangeButton:!0}],qe={en:{whyChooseUs:"Why Customers Choose Us",chipTrusted:"Trusted",chipFairExchange:"Fair Exchange",chipFast:"Fast",chipWarranty:"1 Year Warranty",faqTitle:"Warranty & Policies",goToExchange:"Go to Exchange →"},am:{whyChooseUs:"ደንበኞቻችን ለምን ይመርጡናል",chipTrusted:"ታማኝ",chipFairExchange:"ፍትሃዊ ልውውጥ",chipFast:"ፈጣን",chipWarranty:"1 ዓመት ዋስትና",faqTitle:"ዋስትና እና ፖሊሲዎች",goToExchange:"ወደ ልውውጥ ሂድ →"}};function Ze({onNavigateToExchange:o}){const{sessionId:t,telegramUser:n}=ie(),r=de(t),i=n?.language_code?.startsWith("am")?"am":"en",a=qe[i],[l,c]=g.useState(""),m=g.useRef(null),f=["✅ Verified Phones","🔄 Exchange Available","📍 Addis Ababa"],x=[{emoji:"✅",label:a.chipTrusted,faqId:"item-4"},{emoji:"💰",label:a.chipFairExchange,faqId:"item-7"},{emoji:"⚡",label:a.chipFast,faqId:"item-5"},{emoji:"🔒",label:a.chipWarranty,faqId:"item-1"}],h=[{icon:be,text:"Fast response"},{icon:ge,text:"Fair exchange evaluation"},{icon:ce,text:"Clear prices"}],v=s=>{c(s),setTimeout(()=>{m.current?.scrollIntoView({behavior:"smooth",block:"start"})},50)},y=async()=>{if(t&&A.phoneNumberE164)try{await r.mutate({actionType:"call",sourceTab:"about",timestamp:Date.now()})}catch{}window.location.href=`tel:${A.phoneNumberE164}`},I=async()=>{if(t&&A.mapsUrl)try{await r.mutate({actionType:"map",sourceTab:"about",timestamp:Date.now()})}catch{}window.open(A.mapsUrl,"_blank")};return e.jsxs("div",{className:"min-h-screen bg-background pb-24",children:[e.jsx("header",{className:"sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border",children:e.jsx("div",{className:"p-4 animate-slide-down",children:e.jsx("h1",{className:"text-xl font-bold text-foreground",children:"About Micky Mobile"})})}),e.jsxs("div",{className:"p-4 space-y-6",children:[e.jsxs("div",{className:"text-center space-y-3 animate-fade-in",children:[e.jsx("div",{className:"w-20 h-20 mx-auto rounded-2xl overflow-hidden flex items-center justify-center shadow-lg animate-bounce-in hover-glow",children:e.jsx("img",{src:le,alt:"TED MOBILE",className:"w-full h-full object-cover"})}),e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl font-bold text-foreground",children:"Micky Mobile™"}),e.jsx("p",{className:"text-muted-foreground",children:"We sell, buy and exchange."})]}),e.jsx("div",{className:"flex flex-wrap justify-center gap-2",children:f.map((s,p)=>e.jsx("span",{className:"px-3 py-1.5 bg-primary/15 border border-primary/25 text-primary text-xs font-semibold rounded-full opacity-0 animate-fade-in",style:{animationDelay:`${.2+p*.1}s`,animationFillMode:"forwards"},children:s},s))})]}),e.jsxs("div",{className:"space-y-3",children:[e.jsx("h3",{className:"font-semibold text-foreground animate-slide-in-left",children:a.whyChooseUs}),e.jsx("div",{className:"grid grid-cols-2 sm:grid-cols-4 gap-3",children:x.map((s,p)=>e.jsxs("button",{onClick:()=>v(s.faqId),"aria-label":s.label,className:"h-10 overflow-hidden flex items-center justify-center gap-1.5 rounded-full border border-border bg-card text-foreground text-sm font-medium hover:bg-muted active:scale-95 transition-all duration-150 opacity-0 animate-fade-in",style:{animationDelay:`${.3+p*.07}s`,animationFillMode:"forwards"},children:[e.jsx("span",{"aria-hidden":"true",children:s.emoji}),e.jsx("span",{className:"truncate min-w-0",children:s.label})]},s.faqId))})]}),e.jsxs("div",{className:"bg-primary/10 rounded-2xl p-4 border border-primary/15 opacity-0 animate-fade-in",style:{animationDelay:"0.6s",animationFillMode:"forwards"},children:[e.jsx("h3",{className:"font-semibold text-foreground mb-3",children:"Today's Service Promise"}),e.jsx("div",{className:"space-y-2",children:h.map((s,p)=>{const w=s.icon;return e.jsxs("div",{className:"flex items-center gap-2 opacity-0 animate-fade-in",style:{animationDelay:`${.7+p*.05}s`,animationFillMode:"forwards"},children:[e.jsx(w,{className:"w-4 h-4 text-primary"}),e.jsx("span",{className:"text-sm text-foreground/80",children:s.text})]},p)})})]}),e.jsxs("div",{className:"bg-card rounded-2xl p-4 border border-border opacity-0 animate-fade-in hover-lift",style:{animationDelay:"0.8s",animationFillMode:"forwards"},children:[e.jsx("h3",{className:"font-semibold text-foreground mb-3",children:"አድራሻ"}),e.jsx("div",{className:"space-y-1 text-sm text-muted-foreground",children:e.jsxs("p",{className:"flex items-start gap-2",children:[e.jsx(ye,{className:"w-4 h-4 text-primary mt-0.5 flex-shrink-0 animate-pulse-soft"}),e.jsx("span",{children:"Bole Alemnesh Plaza Ground Floor"})]})})]}),e.jsxs("div",{ref:m,className:"space-y-3 scroll-mt-16 opacity-0 animate-fade-in",style:{animationDelay:"0.88s",animationFillMode:"forwards"},children:[e.jsx("h3",{className:"font-semibold text-foreground",children:a.faqTitle}),e.jsx("div",{className:"bg-card rounded-2xl border border-border overflow-hidden",children:e.jsx(Se,{type:"single",collapsible:!0,value:l,onValueChange:c,children:We.map(s=>e.jsxs(ee,{value:s.id,children:[e.jsx(oe,{className:"px-4 py-3 text-sm font-medium text-left text-foreground hover:no-underline hover:bg-muted/40 [&[data-state=open]]:bg-muted/20 transition-colors",children:s.title}),e.jsxs(ne,{className:"px-4 pb-4 pt-1 text-sm text-muted-foreground",children:[e.jsx("p",{className:"whitespace-pre-line leading-relaxed",children:s.content}),s.contentAm&&e.jsx("p",{className:"whitespace-pre-line leading-relaxed mt-3 pt-3 border-t border-border/40 text-muted-foreground/80",children:s.contentAm}),s.hasExchangeButton&&e.jsx("button",{onClick:o,className:"mt-3 w-full py-2.5 bg-primary text-primary-foreground font-medium rounded-xl text-sm active:scale-95 hover:bg-primary/90 transition-all duration-150",children:a.goToExchange})]})]},s.id))})})]}),e.jsxs("div",{className:"space-y-2 opacity-0 animate-slide-up",style:{animationDelay:"0.95s",animationFillMode:"forwards"},children:[e.jsxs("button",{onClick:y,disabled:!1,className:"w-full py-3 bg-primary text-primary-foreground font-medium rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all duration-300 text-sm press-effect shadow-button hover-glow group disabled:opacity-50 disabled:cursor-not-allowed",children:[e.jsx(we,{className:"w-4 h-4 transition-transform duration-300 group-hover:rotate-12"}),e.jsx("span",{children:"Call Physical Store"})]}),e.jsxs("button",{onClick:I,disabled:!1,className:"w-full py-3 bg-secondary text-secondary-foreground font-medium rounded-xl flex items-center justify-center gap-2 hover:bg-secondary/80 transition-all duration-300 text-sm press-effect group disabled:opacity-50 disabled:cursor-not-allowed",children:[e.jsx(ve,{className:"w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"}),e.jsx("span",{children:"Get Directions"})]})]})]})]})}export{Ze as AboutTab};
