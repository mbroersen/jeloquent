var O=Object.defineProperty;var n=(u,e)=>O(u,"name",{value:e,configurable:!0});var d=class{constructor(e,t){this.isPrimary=t!=null?t:!1,this.$name=e,this.$fieldValue=null,this.$previousValue=void 0,this.$originalValue=void 0,this.$parent=null}get isDirty(){return this.$fieldValue!=this.$previousValue}get originalValue(){return this.$originalValue}get previousValue(){return this.$previousValue}get value(){return this.$fieldValue}set value(e){this.$fieldValue=e}setName(){return this}setup(e){return this.$parent=e,this.setName().setParentProperties()}tableSetup(){}addParentFieldValueLookUp(){Object.defineProperty(this.$parent,this.$name,{get:()=>this.value,set:e=>{var t,s;this.$previousValue===void 0&&(this.$previousValue=JSON.parse(JSON.stringify((t=this.value)!=null?t:e))),this.$originalValue===void 0&&(this.$originalValue=JSON.parse(JSON.stringify((s=this.value)!=null?s:e))),this.$previousValue=JSON.parse(JSON.stringify(this.value)),this.value=e}})}addParentOriginalValueLookUp(){Object.defineProperty(this.$parent,`original_${this.$name}`,{get:()=>this.originalValue})}setParentProperties(){return this.addParentFieldValueLookUp(),this.addParentOriginalValueLookUp(),this.setFillPropertyOnParent(),this}setFillPropertyOnParent(){Object.defineProperty(this.$parent,`_${this.$name}`,{set:e=>{this.$originalValue===void 0&&(this.$originalValue=JSON.parse(JSON.stringify(this.value))),this.$previousValue=JSON.parse(JSON.stringify(this.value)),this.$fieldValue=e}})}resetDirty(){this.$originalValue=JSON.parse(JSON.stringify(this.$fieldValue)),this.$previousValue=JSON.parse(JSON.stringify(this.$fieldValue))}toJson(){let e={};return e[this.$name]=this.value,JSON.parse(JSON.stringify(e))}};n(d,"Field");var m=class extends d{constructor(e,t){super(e);this.foreignKey=e!=null?e:t}setRelation(e){return this.relation=e,this}get value(){return this.$fieldValue}set value(e){this.$fieldValue=e}tableSetup(e){e.registerIndex(this.foreignKey)}};n(m,"ForeignKey");var l=class extends d{constructor(e,t,s){let r=s!=null?s:e.snakeCaseClassName;super(r);this.model=e,this.foreignKey=t}tableSetup(e){e.registerIndex(this.foreignKey)}getRelationalFields(){return[new m(this.foreignKey).setRelation(this)]}setFillPropertyOnParent(){Object.defineProperty(this.$parent,`_${this.$name}`,{set:e=>{Array.isArray(e)||(e=[e]),e.forEach(t=>{this.model.ids().includes(t.id)||this.model.insert(t)})}})}};n(l,"Relation");var y=class extends l{constructor(e,t,s,r){super(e,s);this.model=e,this.throughModel=t,this.localKey=r!=null?r:"id"}get indexName(){return`${this._lcThroughModelClassName}.${this._lcParentClassName}_id`}get value(){return this.getValueByParentKey("primaryKey")}get originalValue(){return this.getValueByParentKey("originalPrimaryKey")}getValueByParentKey(e){var s,r;let t=this.model.getIndexByKey(this.indexName);return globalThis.Store.database().find(this.model.className,[...(r=(s=t.get(this.$parent[e]))==null?void 0:s.values())!=null?r:[]])}setName(){return this._lcThroughModelClassName=this.throughModel.snakeCaseClassName,this._lcModelClassName=this.model.snakeCaseClassName,this._lcParentClassName=this.$parent.snakeCaseClassName,this.foreignKey=`${this._lcThroughModelClassName}_id`,this.$name=`${this._lcModelClassName}s`,this}tableSetup(){this.model.registerIndex(this.indexName)}getRelationalFields(){return[]}};n(y,"HasManyThrough");var $=class extends l{constructor(e,t,s){super(e,t);this.localKey=s!=null?s:"id"}get count(){var t,s;return(s=(t=globalThis.Store.database().indexes(this.model.className).get(this.foreignKey).get(this.$parent.primaryKey))==null?void 0:t.size)!=null?s:0}get value(){return this.getValueByParentKey("primaryKey")}get originalValue(){return this.getValueByParentKey("originalPrimaryKey")}getValueByParentKey(e){var s,r;let t=this.model.getIndexByKey(this.foreignKey);return globalThis.Store.database().find(this.model.className,[...(r=(s=t.get(this.$parent[e]))==null?void 0:s.values())!=null?r:[]])}setName(){let e=this.$parent.snakeCaseClassName,t=this.model.snakeCaseClassName;return this.foreignKey=`${e}_id`,this.$name=`${t}s`,this}getRelationalFields(){return[]}setParentProperties(){return super.setParentProperties(),Object.defineProperty(this.$parent,`${this.$name}Count`,{get:()=>this.count}),Object.defineProperty(this.$parent,`has${this.model.className}s`,{get:()=>this.count>0}),this}};n($,"HasMany");var x=class extends l{constructor(e,t,s){super(e,t!=null?t:`${e.snakeCaseClassName}_id`,s)}get value(){return this.model.find(this.$parent[this.foreignKey])}get originalValue(){return this.model.find(this.$parent[`original_${this.foreignKey}`])}set value(e){}setName(){var t;let e=this.model.snakeCaseClassName;return this.$name=(t=this.$name)!=null?t:`${e}`,this}setParentProperties(){super.setParentProperties();let e="";for(let t of this.$name.split("_"))e+=t[0].toUpperCase()+t.slice(1);return Object.defineProperty(this.$parent,`has${e}`,{get:()=>this.value!==null}),this}};n(x,"BelongsTo");var C=class extends l{constructor(e){super(e)}get value(){return this.getValueByParentKey("primaryKey")}get originalValue(){return this.getValueByParentKey("originalPrimaryKey")}getValueByParentKey(e){let t=this.$parent.className,s=this.$parent[e],r=`${this.$name}_id`,i=`${this.$name}_type`,a={};return a[r]=s,a[i]=t,this.model.find(a)}getRelationalFields(){return[]}};n(C,"MorphOne");var S=class extends l{constructor(e){super(e)}get value(){return this.getValueByParentKey("primaryKey")}get originalValue(){return this.getValueByParentKey("originalPrimaryKey")}getValueByParentKey(e){var s,r;let t=this.model.getIndexByKey(this.foreignKey);return globalThis.Store.database().find(this.model.className,[...(r=(s=t.get(this.$parent[e]))==null?void 0:s.values())!=null?r:[]]).first()}setName(){return this.foreignKey=`${this.$parent.snakeCaseClassName}_id`,this}getRelationalFields(){return[]}setParentProperties(){return super.setParentProperties(),Object.defineProperty(this.$parent,`has${this.model.className}`,{get:()=>this.value!==null}),this}};n(S,"HasOne");var M=class extends l{constructor(e,t,s,r){super(e,s);this.throughModel=t,this.localKey=r!=null?r:"id"}get value(){var t;return(t=this.$parent[this._lcThroughModelClassName][this._lcModelClassName])!=null?t:null}get originalValue(){var t;return(t=this.$parent[`original_${this._lcThroughModelClassName}`][`original_${this._lcModelClassName}`])!=null?t:null}get indexName(){return`${this._lcThroughModelClassName}.${this._lcParentClassName}_id`}setName(){return this._lcThroughModelClassName=this.throughModel.snakeCaseClassName,this._lcModelClassName=this.model.snakeCaseClassName,this._lcParentClassName=this.$parent.snakeCaseClassName,this.foreignKey=`${this._lcThroughModelClassName}_id`,this.$name=`${this._lcModelClassName}`,this}getRelationalFields(){return[]}};n(M,"HasOneThrough");var w=class extends d{constructor(e){super(e)}get value(){let e=this.$parent.snakeCaseClassName,t=this.$parent[`${e}_type`],s=this.$parent[`${e}_id`];return globalThis.Store.classInstances[t].constructor.find(s)}setFillPropertyOnParent(){Object.defineProperty(this.$parent,`_${this.$name}`,{set:e=>{Array.isArray(e)||(e=[e]);let t=this.$parent.snakeCaseClassName,s=`${t}_type`,r=`${t}_id`;for(let i of e)i.id=i[r],globalThis.Store.classInstances[i[s]].constructor.insert(i)}})}};n(w,"MorphTo");var g=class{constructor(){this._indexes=new Map,this.indexedFields=new Set,this.splitIndexNames=new Map}index(e){return this._indexes.get(e)}indexLookUpKey(e,t){return this.index(e).get(t)}static registerIndex(e,t){this.register(e,t)}static register(e,t){globalThis.Store.database().registerIndex(e.className,t)}static addIndex(e,t){this.add(e,t)}static add(e,t){globalThis.Store.database().addIndex(e.className,t.foreignKey,t.fieldValue,e.primaryKey)}static removeIndex(e,t){this.remove(e,t)}static remove(e,t){globalThis.Store.database().removeIndex(e.className,t.foreignKey,t.previousValue,e.primaryKey)}static removeTmpIdFromIndex(e){let t=e.className;e.dirtyFields.filter(s=>s instanceof m).forEach(s=>{globalThis.Store.database().removeIndex(t,s.$name,s.originalValue,e._tmpId)})}get indexes(){return this._indexes}getIndexByKey(e){return this.index(e)}registerIndex(e){this.register(e)}register(e){this._indexes.has(e)||(this.indexedFields.add(e),this.splitIndexNames.set(e,e.split(".")),this._indexes.set(e,new Map))}addValue(e,t,s){if(!this._indexes.has(e)||s===null)return;if(!this.index(e).has(t)){this.registerLookUpKey(e,t,s);return}let i=this.indexLookUpKey(e,t);i.has(s)||i.add(s)}removeValue(e,t,s){this.indexLookUpKey(e,t).delete(s)}registerLookUpKey(e,t,s){this.index(e).set(t,new Set([s]))}unregisterLookUpKey(e,t){this.index(e).delete(t)}getLookUpValue(e,t){let s=this.splitIndexNames.get(t),r=e;for(let i of s){if(r[`original_${i}`]===null)break;r=r[`original_${i}`]}return r!=null?r:null}addValueByModel(e){for(let[t]of this._indexes)this.addValue(t,this.getLookUpValue(e,t),e.primaryKey)}removeValueByModel(e){for(let[t]of this._indexes)this.removeValue(t,this.getLookUpValue(e,t),e.primaryKey)}truncate(){for(let e in this._indexes)this.index(e).clear()}};n(g,"Index");var c=class extends Array{constructor(...e){super(...e)}_getRowFieldResult(e,t){var r,i;let s=(r=e[t[0]])!=null?r:null;for(let a=1;a<t.length;a++){let h=t[a];if(s===null)break;if(s instanceof c)return s.pluck(t[a]);s=(i=s[h])!=null?i:null}return s}pluck(e,t){let s=e.split(".");if(t){let i=t.split("."),a={};for(let h in this)a[this._getRowFieldResult(this[h],i)]=this._getRowFieldResult(this[h],s);return a}let r=[];for(let i in this)r.push(this._getRowFieldResult(this[i],s));return r}first(){var e;return(e=this[0])!=null?e:null}last(){var e;return(e=this.slice(-1)[0])!=null?e:null}merge(e){return this.push(...e),this}random(){return this[Math.round((this.length-1)*Math.random())]}unique(e){let t={};for(let s in this)t[this[s][e]]=this[s];return new c(...Object.values(t))}jsonStringify(){return JSON.stringify(this)}whereIfFunction(e,t){let s=new c;for(let r in this)t(e,this[r])&&s.push(this[r]);return s}where(e,t,s){s=s!=null?s:t,t=t===s?"==":t;let r={">"(i,a){return i>a},">="(i,a){return i>=a},"<"(i,a){return i<a},"<="(i,a){return i<=a},"!="(i,a){return i!=a},"=="(i,a){return i==a}};if(!Object.prototype.hasOwnProperty.call(r,t))throw new Error("Invalid comparison operator used");return this.whereIfFunction(e,(i,a)=>r[t](a[i],s))}whereBetween(e,t){return this.whereIfFunction(e,(s,r)=>{let i=r[s];return i>=t[0]&&i<=t[1]})}whereNotBetween(e,t){return this.whereIfFunction(e,(s,r)=>{let i=r[s];return!(i>=t[0]&&i<=t[1])})}whereNull(e){return this.whereIfFunction(e,(t,s)=>s[t]===null)}whereNotNull(e){return this.whereIfFunction(e,(t,s)=>s[t]!==null)}whereIn(e,t){return this.whereIfFunction(e,(s,r)=>t.includes(r[s]))}whereNotIn(e,t){return this.whereIfFunction(e,(s,r)=>!t.includes(r[s]))}whereInstanceOf(e){return this.whereIfFunction(null,(t,s)=>s instanceof e)}whereNotInstanceOf(e){return this.whereIfFunction(null,(t,s)=>!(s instanceof e))}};n(c,"Collection");var _=class{constructor(e=[]){this.setFields(this.addRelationFields(e)),this._tmpId=`_${++globalThis.Store.numberOfModelCreated}`}get className(){return this.constructor.className}get primaryKey(){var e,t;return(t=(e=this.primaryFields.reduce((s,r,i)=>i>0?`${s}-${r.value}`:r.value,""))!=null?e:this._tmpId)!=null?t:null}get originalPrimaryKey(){var e,t;return(t=(e=this.primaryFields.reduce((s,r,i)=>i>0?`${s}-${r.originalValue}`:r.originalValue,""))!=null?e:this._tmpId)!=null?t:null}get primaryKeyName(){return this.originalFields.filter(e=>e.isPrimary).map(e=>e.$name)}get originalValues(){return this.originalFields.reduce((e,t)=>(t.originalValue!==void 0&&(e[t.$name]=t.originalValue),e),{})}get dirtyFields(){return this.originalFields.filter(e=>e.isDirty)}get dirtyFieldNames(){return this.dirtyFields.map(e=>e.$name)}get snakeCaseClassName(){return this.constructor.snakeCaseClassName}get kebabCaseClassName(){return this.constructor.kebabCaseClassName}static get snakeCaseClassName(){return this.snakeCaseName||(this.snakeCaseName=this.name[0].toLowerCase()+this.name.slice(1).replace(/([A-Z])/g,"_$1").toLowerCase()),this.snakeCaseName}static get kebabCaseClassName(){return this.kebabCaseName||(this.kebabCaseName=this.name[0].toLowerCase()+this.name.slice(1).replace(/([A-Z])/g,"-$1").toLowerCase()),this.kebabCaseName}static get className(){return this.name}static getInstance(){var s;let e=(s=globalThis.Store.classInstances[this.className])!=null?s:globalThis.Store.classInstances[this.className]=new this,t=e.originalFields.reduce((r,i)=>(r.push(Object.assign(Object.create(Object.getPrototypeOf(i)),i)),r),[]);return Object.create(Object.getPrototypeOf(e)).setFields(t)}static registerIndex(e){g.registerIndex(this.getInstance(),e)}static getIndexByKey(e){let t=this.className;return globalThis.Store.database().getIndexByKey(t,e)}static aSyncInsert(e){return new Promise(t=>{requestAnimationFrame(()=>{t(this.insert(e))})})}static insert(e){let t=Array.isArray(e)?e:[e],s=t.length,r=new c;for(let i=0;i<s;i++){let a=t[i],h=this.getInstance();h.fill(a),globalThis.Store.database().insert(this.className,h),h.fillRelations(a),r.push(h)}return r}static update(e){let t=new this;return t.fill(e),globalThis.Store.database().update(this.className,t),t.fillRelations(e),t}static delete(e){globalThis.Store.database().delete(this.className,e)}static find(e){return globalThis.Store.database().find(this.className,e)}static select(e){try{return globalThis.Store.database().select(this.className,e)}catch(t){console.error(t)}}static all(){return globalThis.Store.database().all(this.className)}static ids(){return globalThis.Store.database().ids(this.className)}tableSetup(e){for(let t=0;t<this.numberOfFields;t++)this.originalFields[t]instanceof m&&this.originalFields[t].tableSetup(e),this.originalFields[t]instanceof y&&this.originalFields[t].tableSetup(e)}isDirty(e){return e?this.dirtyFieldNames.includes(e):this.dirtyFields.length>0}resetDirty(){this.originalFields.filter(e=>!(e instanceof l)).forEach(e=>{e.resetDirty()})}delete(){this.constructor.delete(this.primaryKey)}save(){let e=this.className,t=globalThis.Store.database(),s=t.ids(e);if(this.primaryKey[0]!=="_"&&s.includes(this._tmpId)&&(g.removeTmpIdFromIndex(this),t.delete(e,this._tmpId)),s.includes(this.primaryKey)){t.update(e,this);return}t.insert(e,this)}registerIndex(e){g.register(this,e)}fill(e){for(let t=0;t<this.numberOfFields;t++)if(!(this.originalFields[t]instanceof l)){let s=this.originalFields[t].$name;e[s]!==void 0&&(this[`_${s}`]=e[s])}}fillRelations(e){for(let t=0;t<this.numberOfFields;t++)if(this.originalFields[t]instanceof l){let s=this.originalFields[t].$name;e[s]!==void 0&&(this[`_${s}`]=e[s])}}addRelationFields(e){let t=[...e];return e.forEach((s,r)=>{s instanceof l&&t.splice(r,0,...s.getRelationalFields())}),this.numberOfFields=t.length,t}setFields(e){this.originalFields=[...e],this.numberOfFields=this.originalFields.length;for(let t=0;t<this.numberOfFields;t++)this.originalFields[t].setup(this);return Object.defineProperty(this,"indexedFields",{get:()=>this.originalFields.filter(t=>t instanceof m).reduce((t,s)=>(t.add(s.$name),t),new Set)}),this.primaryFields=this.originalFields.filter(t=>t.isPrimary),this}jsonStringify(){return JSON.stringify(this.toObject())}toJSON(){return this.toObject()}toObject(e=!1){let t={};for(let s=0;s<this.originalFields.length;s++){let r=this.originalFields[s];if(!(r instanceof l&&e)){if(t[r.$name]=r.value,t[r.$name]instanceof _){t[r.$name]=t[r.$name].toObject(!0);continue}t[r.$name]instanceof Array&&(t[r.$name]=[...t[r.$name].map(i=>{var a;return(a=i==null?void 0:i.toObject(!0))!=null?a:i})])}}return{...t}}},b=_;n(b,"Model"),"constructor";var p=class{constructor(e){this.setup(e.getInstance())}static make(e){return new p(e)}setup(e){this.model=e,this.name=e.className,this.models=new Map,this.index=new g,this.primaryKeyFieldNames=e.primaryKeyName}setupIndexes(){this.model.tableSetup(this)}registerIndex(e){this.index.register(e)}addIndex(e,t,s){this.index.addValue(e,t,s)}removeIndex(e,t,s){this.index.removeValue(e,t,s)}getIndexByKey(e){return this.index.getIndexByKey(e)}get indexes(){return this.index.indexes}allModels(){return this.models}get ids(){return[...this.models.keys()]}all(){let e=[...this.models.values()],t=e.length,s=new c;for(let r=0;r<t;r+=1e4)s.push(...e.slice(r,r+1e4));return s}insert(e){if(this.models.has(e.primaryKey))throw new Error("Record already exists");if(!(e instanceof b))throw new Error("Record should be instance of model");e.resetDirty(),e.primaryKey!=null&&this.models.set(e.primaryKey,e),this.index.addValueByModel(e)}update(e){if(!this.models.has(e.primaryKey))throw new Error("Record doesn't exists");if(!(e instanceof b))throw new Error("Record should be instance of model");this.index.removeValueByModel(e),e.resetDirty(),this.index.addValueByModel(e),this.models.set(e.primaryKey,e)}delete(e){if(!this.models.has(e))throw new Error("Record doesn't exists");this.index.removeValueByModel(this.find(e)),this.models.delete(e)}truncate(){this.models.clear(),this.index.truncate()}getKey(e){var s;if(typeof e=="string")return e;if(e===null)return null;let t=[];for(let r=0;r<this.primaryKeyFieldNames.length;r++)t.push((s=e[this.primaryKeyFieldNames[r]])!=null?s:"");return t.join("-")}find(e){var s,r;let t=this.primaryKeyFieldNames.length>1;if(Array.isArray(e)){let i=[],a=t?h=>{var N;i.push((N=this.models.get(this.getKey(e[h])))!=null?N:null)}:h=>{var N;i.push((N=this.models.get(e[h]))!=null?N:null)};for(let h=0;h<e.length;h++)a(h);return new c(...i)}return t?(s=this.models.get(this.getKey(e)))!=null?s:null:(r=this.models.get(e))!=null?r:null}select(e){if(!this.models.has(e))throw new Error("Record doesn't exists");return this.find(e)}};n(p,"Table");var P=class{constructor(e,t){this._name=e,this._tables=new Map,t.forEach(s=>{let r=new p(s);this._tables.set(r.name,r)})}get name(){return this._name}register(e){let t=new p(e);this._tables.set(t.name,t)}table(e){return this._tables.get(e)}setIndexes(){this._tables.forEach(e=>{e.setupIndexes()})}showTables(){return this._tables.keys()}ids(e){return this.table(e).ids}all(e){return this.table(e).all()}allModels(e){return this.table(e).allModels()}registerIndex(e,t){this.table(e).registerIndex(t)}addIndex(e,t,s,r){this.table(e).addIndex(t,s,r)}removeIndex(e,t,s,r){this.table(e).removeIndex(t,s,r)}getIndexByKey(e,t){return this.table(e).getIndexByKey(t)}indexes(e){return this.table(e).indexes}insert(e,t){return this.table(e).insert(t)}update(e,t){return this.table(e).update(t)}find(e,t){return this.table(e).find(t)}select(e,t){return this.table(e).select(t)}delete(e,t){return this.table(e).delete(t)}drop(e){this._tables.delete(e)}truncate(e){this.table(e).truncate()}query(e){let t=e.match(/^((SELECT)|(INSERT)|(DELETE))\s+(.*)\s+FROM\s+([^\s]+)(\s+WHERE\s+([^\s]+)\s+(=)\s+([^\s+]))?((\s+)|;)?$/i);if(t.length===0)return null;let s=t[1],r=t[6],i=t[8],a=t[10];return i==="id"?this[s.toLowerCase()](r,a):i===void 0&&s==="SELECT"?this.all(r):null}};n(P,"Database");var o=class{constructor(e,t,s){this.model=e,this.action=t,this.data=s}addCallback(e){this.callback=e}execute(){var e;this.model[this.action](this.data),((e=this.callback)!=null?e:()=>null)()}};n(o,"QueueMessage");var f=class{constructor(e){this.connectionRequestSettings=e}modelApiLocation(e){return`${this.connectionRequestSettings.getBaseUrl()}/${e.kebabCaseClassName}`}post(e){return fetch(this.modelApiLocation(e),{method:"POST",body:JSON.stringify(e.jsonStringify()),...this.connectionRequestSettings.getSettings()})}all(e){return fetch(`${this.modelApiLocation(e)}`,{method:"GET",...this.connectionRequestSettings.getSettings()})}get(e){return fetch(`${this.modelApiLocation(e)}/${e.primaryKey}`,{method:"GET",...this.connectionRequestSettings.getSettings()})}patch(e){return fetch(`${this.modelApiLocation(e)}/${e.primaryKey}`,{method:"PATCH",body:JSON.stringify(e.dirtyFields),...this.connectionRequestSettings.getSettings()})}put(e){return fetch(`${this.modelApiLocation(e)}/`,{method:"PUT",body:JSON.stringify(e.jsonStringify()),...this.connectionRequestSettings.getSettings()})}delete(e){return fetch(`${this.modelApiLocation(e)}/${e.primaryKey}`,{method:"DELETE",...this.connectionRequestSettings.getSettings()})}};n(f,"ConnectionRequest");var I=class{constructor(e){this.connectionSettings=e}get isRemote(){return!0}get isLocal(){return!1}load(e){return this.all(e)}responseJson(e){return e.json()}all(e){return new Promise(t=>{new f(this.connectionSettings).all(e).then(s=>this.responseJson(s)).then(s=>{let r=new o(e,"insert",s);t(r)})})}get(e){return new Promise(t=>{new f(this.connectionSettings).get(e).then(s=>this.responseJson(s)).then(s=>{let r=new o(e,"fill",s);t(r)})})}post(e){return new Promise(t=>{new f(this.connectionSettings).post(e).then(s=>this.responseJson(s)).then(s=>{let r=new o(e,"fill",s);t(r)})})}put(e){return new Promise(t=>{new f(this.connectionSettings).put(e).then(s=>this.responseJson(s)).then(s=>{let r=new o(e,"fill",s);t(r)})})}patch(e){return new Promise(t=>{new f(this.connectionSettings).patch(e).then(s=>this.responseJson(s)).then(s=>{let r=new o(e,"fill",s);t(r)})})}delete(e){return new Promise(t=>{new f(this.connectionSettings).delete(e).then(s=>this.responseJson(s)).then(s=>{let r=new o(e,"delete",s);t(r)})})}};n(I,"JsonRequestAdapter");var F=class{constructor(e){this.connectionSettings=e}all(e){return Promise.resolve(t=>{t(new o(e,"aSyncUpdate",this.getTableFromLocalStorage(e)))})}delete(e){return Promise.resolve(t=>{t(new o(e,"aSyncUpdate",this.getTableFromLocalStorage(e)))})}get(e){return Promise.resolve(t=>{t(new o(e,"aSyncUpdate",this.getTableFromLocalStorage(e)))})}patch(e){return Promise.resolve(t=>{t(new o(e,"aSyncUpdate",this.getTableFromLocalStorage(e)))})}put(e){return Promise.resolve(t=>{t(new o(e,"aSyncUpdate",this.getTableFromLocalStorage(e)))})}load(e){return Promise.resolve(new Promise(t=>{t(new o(e,"aSyncInsert",this.getTableFromLocalStorage(e)))}))}post(e){return new Promise(t=>{t(new o(e,"aSyncInsert",this.getTableFromLocalStorage(e)))})}getLocalStorageKey(e){return`jeloquent-${globalThis.Store.useDatabase}-${e.className}`}getTableFromLocalStorage(e){var t;return JSON.parse((t=localStorage.getItem(this.getLocalStorageKey(e)))!=null?t:"[]")}};n(F,"LocalStorageAdapter");var v=class{constructor(e){this.connectionSettings=e}load(e){return new Promise(t=>{t(new o(e,"insert",this.options[e.className]))})}all(e){return new Promise(t=>{t(new o(e,"insert",this.options[e.className]))})}delete(e){return new Promise(t=>{t(new o(e,"insert",this.options[e.className]))})}get(e){return new Promise(t=>{t(new o(e,"insert",this.options[e.className]))})}patch(e){return new Promise(t=>{t(new o(e,"insert",this.options[e.className]))})}post(e){return new Promise(t=>{t(new o(e,"insert",this.options[e.className()]))})}put(e){return new Promise(t=>{t(new o(e,"insert",this.options[e.className()]))})}};n(v,"LocalArrayAdapter");var T=class{static getAdapter(e,t){return e==="jsonRequest"?new I(t):e==="localStorage"?new F(t):e==="localArray"?new v(t):new I(t)}};n(T,"ConnectionAdapterFactory");var V=class{constructor(e,t){e instanceof String?this.adapter=T.getAdapter(e,t):this.adapter=e,this.updateQueue=[],this.paused=!1}processQueue(){var t;let e=((t=this.updateQueue)!=null?t:[]).shift();!e||(e.execute(),setTimeout(()=>{this.processQueue()},1))}addToQueue(...e){this.updateQueue.push(...e)}pause(){this.paused=!0}resume(){this.paused=!1}load(e){return this.all(e)}all(e){return new Promise(t=>{this.adapter.all(e).then(s=>{s.addCallback(t),this.addToQueue(s),setTimeout(()=>{this.processQueue()},1)})})}post(e){return new Promise(t=>{this.adapter.post(e).then(s=>{s.addCallback(t),this.addToQueue(s),setTimeout(()=>{this.processQueue()},1)})})}put(e){return new Promise(t=>{this.adapter.put(e).then(s=>{s.addCallback(t),this.addToQueue(s),setTimeout(()=>{this.processQueue()},1)})})}patch(e){return new Promise(t=>{this.adapter.patch(e).then(s=>{s.addCallback(t),this.addToQueue(s),setTimeout(()=>{this.processQueue()},1)})})}delete(e){return new Promise(t=>{this.adapter.delete(e).then(s=>{s.addCallback(t),this.addToQueue(s),setTimeout(()=>{this.processQueue()},1)})})}};n(V,"Connection");var K=class{constructor(){this.classInstances={},this.databases=new Map,this.connections=new Map,this.numberOfModelCreated=0,this.useDatabase="default",this.useConnectionName="default",globalThis.Store=this}use(e="default"){var t;this.useDatabase=e,(t=this.databases.get(this.useDatabase))==null||t.setIndexes()}add(e){this.databases.set(e.name,e)}addConnection(e,t="default"){this.connections.set(t,e)}useConnections(e){this.useConnection(e)}useConnection(e="default"){this.useConnectionName=e}database(){var e;return(e=this.databases.get(this.useDatabase))!=null?e:null}connection(){var e;return(e=this.connections.get(this.useConnectionName))!=null?e:null}};n(K,"Store");export{x as BelongsTo,c as Collection,V as Connection,T as ConnectionAdapterFactory,P as Database,d as Field,m as ForeignKey,$ as HasMany,y as HasManyThrough,S as HasOne,M as HasOneThrough,b as Model,C as MorphOne,w as MorphTo,o as QueueMessage,l as Relation,K as Store,p as Table};
