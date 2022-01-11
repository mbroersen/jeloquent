var O=Object.defineProperty;var n=(u,e)=>O(u,"name",{value:e,configurable:!0});var d=class{constructor(e,t=!1){this._isPrimary=t,this.$name=e,this.$fieldValue=null,this.$previousValue=void 0,this.$originalValue=void 0,this.$parent=null}get isDirty(){return this.$fieldValue!=this.$previousValue}get isPrimary(){return this._isPrimary}get name(){return this.$name}get originalValue(){return this.$originalValue}get previousValue(){return this.$previousValue}get value(){return this.$fieldValue}set value(e){this.$fieldValue=e}resetDirty(){this.$originalValue=JSON.parse(JSON.stringify(this.$fieldValue)),this.$previousValue=JSON.parse(JSON.stringify(this.$fieldValue))}setName(){return this}setup(e){return this.$parent=e,this.setName().setParentProperties()}tableSetup(e){console.info(e.name)}toJson(){let e={};return e[this.$name]=this.value,JSON.parse(JSON.stringify(e))}addParentFieldValueLookUp(){Object.defineProperty(this.$parent,this.$name,{get:()=>this.value,set:e=>{var t,r;this.$previousValue===void 0&&(this.$previousValue=JSON.parse(JSON.stringify((t=this.value)!=null?t:e))),this.$originalValue===void 0&&(this.$originalValue=JSON.parse(JSON.stringify((r=this.value)!=null?r:e))),this.$previousValue=JSON.parse(JSON.stringify(this.value)),this.value=e}})}addParentOriginalValueLookUp(){Object.defineProperty(this.$parent,`original_${this.$name}`,{get:()=>this.originalValue})}setFillPropertyOnParent(){Object.defineProperty(this.$parent,`_${this.$name}`,{set:e=>{var t;this.$originalValue===void 0&&(this.$originalValue=JSON.parse(JSON.stringify((t=this.value)!=null?t:e))),this.$previousValue=JSON.parse(JSON.stringify(this.value)),this.value=e}})}setParentProperties(){return this.addParentFieldValueLookUp(),this.addParentOriginalValueLookUp(),this.setFillPropertyOnParent(),this}};n(d,"Field");var h=class extends d{constructor(e,t=null){super(e);this._foreignKey=e!=null?e:t}get foreignKey(){return this._foreignKey}get value(){return this.$fieldValue}set value(e){this.$fieldValue=e}setRelation(e){return this.relation=e,this}tableSetup(e){e.registerIndex(this.foreignKey)}};n(h,"ForeignKey");var l=class extends d{constructor(e,t=null,r=null){let s=r!=null?r:e.snakeCaseClassName;super(s);this.model=e,this.foreignKey=t}getRelationalFields(){return[new h(this.foreignKey).setRelation(this)]}tableSetup(e){e.registerIndex(this.foreignKey)}setFillPropertyOnParent(){Object.defineProperty(this.$parent,`_${this.$name}`,{set:e=>{Array.isArray(e)||(e=[e]),e.forEach(t=>{this.model.ids().includes(t.id)||this.model.insert(t)})}})}};n(l,"Relation");var y=class extends l{constructor(e,t,r,s){super(e,r);this.model=e,this.throughModel=t,this.localKey=s!=null?s:"id"}get indexName(){return`${this._lcThroughModelClassName}.${this._lcParentClassName}_id`}get originalValue(){return this.getValueByParentKey("originalPrimaryKey")}get value(){return this.getValueByParentKey("primaryKey")}getRelationalFields(){return[]}setName(){return this._lcThroughModelClassName=this.throughModel.snakeCaseClassName,this._lcModelClassName=this.model.snakeCaseClassName,this._lcParentClassName=this.$parent.snakeCaseClassName,this.foreignKey=`${this._lcThroughModelClassName}_id`,this.$name=`${this._lcModelClassName}s`,this}tableSetup(){this.model.registerIndex(this.indexName)}getValueByParentKey(e){var r,s;let t=this.model.getIndexByKey(this.indexName);return globalThis.Store.database().find(this.model.className,[...(s=(r=t.get(this.$parent[e]))==null?void 0:r.values())!=null?s:[]])}};n(y,"HasManyThrough");var M=class extends l{constructor(e,t,r){super(e,t);this.localKey=r!=null?r:"id"}get count(){var t,r;return(r=(t=globalThis.Store.database().indexes(this.model.className).get(this.foreignKey).get(this.$parent.primaryKey))==null?void 0:t.size)!=null?r:0}get originalValue(){return this.getValueByParentKey("originalPrimaryKey")}get value(){return this.getValueByParentKey("primaryKey")}getRelationalFields(){return[]}setName(){let e=this.$parent.snakeCaseClassName,t=this.model.snakeCaseClassName;return this.foreignKey=`${e}_id`,this.$name=`${t}s`,this}getValueByParentKey(e){var r,s;let t=this.model.getIndexByKey(this.foreignKey);return globalThis.Store.database().find(this.model.className,[...(s=(r=t.get(this.$parent[e]))==null?void 0:r.values())!=null?s:[]])}setParentProperties(){return super.setParentProperties(),Object.defineProperty(this.$parent,`${this.name}Count`,{get:()=>this.count}),Object.defineProperty(this.$parent,`has${this.model.className}s`,{get:()=>this.count>0}),this}};n(M,"HasMany");var S=class extends l{constructor(e,t=null,r){super(e,t!=null?t:`${e.snakeCaseClassName}_id`,r)}get originalValue(){return this.model.find(this.$parent[`original_${this.foreignKey}`])}get value(){return this.model.find(this.$parent[this.foreignKey])}set value(e){}setName(){var t;let e=this.model.snakeCaseClassName;return this.$name=(t=this.$name)!=null?t:`${e}`,this}setParentProperties(){super.setParentProperties();let e="";for(let t of this.$name.split("_"))e+=t[0].toUpperCase()+t.slice(1);return Object.defineProperty(this.$parent,`has${e}`,{get:()=>this.value!==null}),this}};n(S,"BelongsTo");var v=class extends l{constructor(e){super(e)}get originalValue(){return this.getValueByParentKey("originalPrimaryKey")}get value(){return this.getValueByParentKey("primaryKey")}getRelationalFields(){return[]}getValueByParentKey(e){let t=this.$parent.className,r=this.$parent[e],s=`${this.name}_id`,i=`${this.name}_type`,a={};return a[s]=r,a[i]=t,this.model.find(a)}};n(v,"MorphOne");var N=class extends l{constructor(e){super(e)}get originalValue(){return this.getValueByParentKey("originalPrimaryKey")}get value(){return this.getValueByParentKey("primaryKey")}getRelationalFields(){return[]}setName(){return this.foreignKey=`${this.$parent.snakeCaseClassName}_id`,this}setParentProperties(){return super.setParentProperties(),Object.defineProperty(this.$parent,`has${this.model.className}`,{get:()=>this.value!==null}),this}getValueByParentKey(e){var r,s;let t=this.model.getIndexByKey(this.foreignKey);return globalThis.Store.database().find(this.model.className,[...(s=(r=t.get(this.$parent[e]))==null?void 0:r.values())!=null?s:[]]).first()}};n(N,"HasOne");var C=class extends l{constructor(e,t,r,s="id"){super(e,r);this.throughModel=t,this.localKey=s}get indexName(){return`${this._lcThroughModelClassName}.${this._lcParentClassName}_id`}get originalValue(){var t;return(t=this.$parent[`original_${this._lcThroughModelClassName}`][`original_${this._lcModelClassName}`])!=null?t:null}get value(){var t;return(t=this.$parent[this._lcThroughModelClassName][this._lcModelClassName])!=null?t:null}getRelationalFields(){return[]}setName(){return this._lcThroughModelClassName=this.throughModel.snakeCaseClassName,this._lcModelClassName=this.model.snakeCaseClassName,this._lcParentClassName=this.$parent.snakeCaseClassName,this.foreignKey=`${this._lcThroughModelClassName}_id`,this.$name=`${this._lcModelClassName}`,this}};n(C,"HasOneThrough");var w=class extends d{constructor(e){super(e)}get value(){let e=this.$parent.snakeCaseClassName,t=this.$parent[`${e}_type`],r=this.$parent[`${e}_id`];return globalThis.Store.classInstances[t].constructor.find(r)}setFillPropertyOnParent(){Object.defineProperty(this.$parent,`_${this.name}`,{set:e=>{Array.isArray(e)||(e=[e]);let t=this.$parent.snakeCaseClassName,r=`${t}_type`,s=`${t}_id`;for(let i of e)i.id=i[s],globalThis.Store.classInstances[i[r]].constructor.insert(i)}})}};n(w,"MorphTo");var m=class{constructor(){this._indexes=new Map,this.indexedFields=new Set,this.splitIndexNames=new Map}get indexes(){return this._indexes}static add(e,t){globalThis.Store.database().addIndex(e.className,t.foreignKey,t.value,e.primaryKey)}static addIndex(e,t){this.add(e,t)}static register(e,t){globalThis.Store.database().registerIndex(e.className,t)}static registerIndex(e,t){this.register(e,t)}static remove(e,t){globalThis.Store.database().removeIndex(e.className,t.foreignKey,t.previousValue,e.primaryKey)}static removeIndex(e,t){this.remove(e,t)}static removeTmpIdFromIndex(e){let t=e.className;e.dirtyFields.filter(r=>r instanceof h).forEach(r=>{globalThis.Store.database().removeIndex(t,r.name,r.originalValue,e._tmpId)})}addValue(e,t,r){if(!this._indexes.has(e)||r===null)return;if(!this.index(e).has(t)){this.registerLookUpKey(e,t,r);return}let i=this.indexLookUpKey(e,t);i.has(r)||i.add(r)}addValueByModel(e){for(let[t]of this._indexes)this.addValue(t,this.getLookUpValue(e,t),e.primaryKey)}getIndexByKey(e){return this.index(e)}getLookUpValue(e,t){let r=this.splitIndexNames.get(t),s=null,i=e;for(let a of r){if(i[`original_${a}`]===null)break;i=i[`original_${a}`],s=i}return s!=null?s:null}register(e){this._indexes.has(e)||(this.indexedFields.add(e),this.splitIndexNames.set(e,e.split(".")),this._indexes.set(e,new Map))}registerIndex(e){this.register(e)}registerLookUpKey(e,t,r){this.index(e).set(t,new Set([r]))}removeValue(e,t,r){this.indexLookUpKey(e,t).delete(r)}removeValueByModel(e){for(let[t]of this._indexes)this.removeValue(t,this.getLookUpValue(e,t),e.primaryKey)}truncate(){for(let e in this._indexes)this.index(e).clear()}unregisterLookUpKey(e,t){this.index(e).delete(t)}index(e){return this._indexes.get(e)}indexLookUpKey(e,t){return this.index(e).get(t)}};n(m,"Index");var c=class extends Array{constructor(...e){super(...e)}_getRowFieldResult(e,t){var s,i;let r=(s=e[t[0]])!=null?s:null;for(let a=1;a<t.length;a++){let p=t[a];if(r===null)break;if(r instanceof c)return r.pluck(t[a]);r=(i=r[p])!=null?i:null}return r}first(){var e;return(e=this[0])!=null?e:null}jsonStringify(){return JSON.stringify(this)}last(){var e;return(e=this.slice(-1)[0])!=null?e:null}merge(e){return this.push(...e),this}pluck(e,t=""){let r=e.split(".");if(t){let i=t.split("."),a={};for(let p in this)a[this._getRowFieldResult(this[p],i)]=this._getRowFieldResult(this[p],r);return a}let s=[];for(let i in this)s.push(this._getRowFieldResult(this[i],r));return s}random(){return this[Math.round((this.length-1)*Math.random())]}unique(e){let t={};for(let r in this)t[this[r][e]]=this[r];return new c(...Object.values(t))}where(e,t,r){r=r!=null?r:t,t=t===r?"==":t;let s={">"(i,a){return i>a},">="(i,a){return i>=a},"<"(i,a){return i<a},"<="(i,a){return i<=a},"!="(i,a){return i!=a},"=="(i,a){return i==a}};if(!Object.prototype.hasOwnProperty.call(s,t))throw new Error("Invalid comparison operator used");return this.whereIfFunction(e,(i,a)=>s[t](a[i],r))}whereBetween(e,t){return this.whereIfFunction(e,(r,s)=>{let i=s[r];return i>=t[0]&&i<=t[1]})}whereIfFunction(e,t){let r=new c;for(let s in this)t(e,this[s])&&r.push(this[s]);return r}whereIn(e,t){return this.whereIfFunction(e,(r,s)=>t.includes(s[r]))}whereInstanceOf(e){return this.whereIfFunction(null,(t,r)=>r instanceof e)}whereNotBetween(e,t){return this.whereIfFunction(e,(r,s)=>{let i=s[r];return!(i>=t[0]&&i<=t[1])})}whereNotIn(e,t){return this.whereIfFunction(e,(r,s)=>!t.includes(s[r]))}whereNotInstanceOf(e){return this.whereIfFunction(null,(t,r)=>!(r instanceof e))}whereNotNull(e){return this.whereIfFunction(e,(t,r)=>r[t]!==null)}whereNull(e){return this.whereIfFunction(e,(t,r)=>r[t]===null)}};n(c,"Collection");var K=class{constructor(e=[]){this.setFields(this.addRelationFields(e)),this._tmpId=`_${++globalThis.Store.numberOfModelCreated}`}static get className(){return this.name}static get kebabCaseClassName(){return this.kebabCaseName||(this.kebabCaseName=this.name[0].toLowerCase()+this.name.slice(1).replace(/([A-Z])/g,"-$1").toLowerCase()),this.kebabCaseName}static get snakeCaseClassName(){return this.snakeCaseName||(this.snakeCaseName=this.name[0].toLowerCase()+this.name.slice(1).replace(/([A-Z])/g,"_$1").toLowerCase()),this.snakeCaseName}get className(){return this.constructor.className}get dirtyFieldNames(){return this.dirtyFields.map(e=>e.name)}get dirtyFields(){return this.originalFields.filter(e=>e.isDirty)}get kebabCaseClassName(){return this.constructor.kebabCaseClassName}get originalPrimaryKey(){var e,t;return(t=(e=this.primaryFields.reduce((r,s,i)=>i>0?`${r}-${s.originalValue}`:s.originalValue,""))!=null?e:this._tmpId)!=null?t:null}get originalValues(){return this.originalFields.reduce((e,t)=>(t.originalValue!==void 0&&(e[t.name]=t.originalValue),e),{})}get primaryKey(){var e,t;return(t=(e=this.primaryFields.reduce((r,s,i)=>i>0?`${r}-${s.value}`:s.value,""))!=null?e:this._tmpId)!=null?t:null}get primaryKeyName(){return this.originalFields.filter(e=>e.isPrimary).map(e=>e.name)}get snakeCaseClassName(){return this.constructor.snakeCaseClassName}static aSyncInsert(e){return new Promise(t=>{queueMicrotask(()=>{t(this.insert(e))})})}static aSyncUpdate(e){return new Promise(t=>{queueMicrotask(()=>{t(this.update(e))})})}static all(){return globalThis.Store.database().all(this.className)}static delete(e){globalThis.Store.database().delete(this.className,e)}static find(e){return globalThis.Store.database().find(this.className,e)}static getIndexByKey(e){let t=this.className;return globalThis.Store.database().getIndexByKey(t,e)}static getInstance(){var r;let e=(r=globalThis.Store.classInstances[this.className])!=null?r:globalThis.Store.classInstances[this.className]=new this,t=e.originalFields.reduce((s,i)=>(s.push(Object.assign(Object.create(Object.getPrototypeOf(i)),i)),s),[]);return Object.create(Object.getPrototypeOf(e)).setFields(t)}static ids(){return globalThis.Store.database().ids(this.className)}static insert(e){let t=Array.isArray(e)?e:[e],r=t.length,s=new c;for(let i=0;i<r;i++){let a=t[i],p=this.getInstance();p.fill(a),globalThis.Store.database().insert(this.className,p),p.fillRelations(a),s.push(p)}return s}static registerIndex(e){m.register(this.getInstance(),e)}static select(e){try{return globalThis.Store.database().select(this.className,e)}catch(t){console.error(t)}}static update(e){let r=(Array.isArray(e)?e:[e]).length,s=new c;for(let i=0;i<r;i++){let a=this.getInstance();a.fill(e),globalThis.Store.database().update(this.className,a),a.fillRelations(e),s.push(a)}return s}addRelationFields(e){let t=[...e];return e.forEach((r,s)=>{r instanceof l&&t.splice(s,0,...r.getRelationalFields())}),this.numberOfFields=t.length,t}delete(){this.constructor.delete(this.primaryKey)}fill(e){for(let t=0;t<this.numberOfFields;t++)if(!(this.originalFields[t]instanceof l)){let r=this.originalFields[t].name;e[r]!==void 0&&(this[`_${r}`]=e[r])}}fillRelations(e){for(let t=0;t<this.numberOfFields;t++)if(this.originalFields[t]instanceof l){let r=this.originalFields[t].name;e[r]!==void 0&&(this[`_${r}`]=e[r])}}isDirty(e){return e?this.dirtyFieldNames.includes(e):this.dirtyFields.length>0}jsonStringify(){return JSON.stringify(this.toObject())}registerIndex(e){m.register(this,e)}resetDirty(){this.originalFields.filter(e=>!(e instanceof l)).forEach(e=>{e.resetDirty()})}save(){let e=this.className,t=globalThis.Store.database(),r=t.ids(e);if(this.primaryKey[0]!=="_"&&r.includes(this._tmpId)&&(m.removeTmpIdFromIndex(this),t.delete(e,this._tmpId)),r.includes(this.primaryKey)){t.update(e,this);return}t.insert(e,this)}setFields(e){this.originalFields=[...e],this.numberOfFields=this.originalFields.length;for(let t=0;t<this.numberOfFields;t++)this.originalFields[t].setup(this);return Object.defineProperty(this,"indexedFields",{get:()=>this.originalFields.filter(t=>t instanceof h).reduce((t,r)=>(t.add(r.name),t),new Set)}),this.primaryFields=this.originalFields.filter(t=>t.isPrimary),this}tableSetup(e){for(let t=0;t<this.numberOfFields;t++)this.originalFields[t]instanceof h&&this.originalFields[t].tableSetup(e),this.originalFields[t]instanceof y&&this.originalFields[t].tableSetup(e)}toJSON(){return this.toObject()}toObject(e=!1){let t={};for(let r=0;r<this.originalFields.length;r++){let s=this.originalFields[r];if(!(s instanceof l&&e)){if(t[s.name]=s.value,t[s.name]instanceof K){t[s.name]=t[s.name].toObject(!0);continue}t[s.name]instanceof Array&&(t[s.name]=[...t[s.name].map(i=>{var a;return(a=i==null?void 0:i.toObject(!0))!=null?a:i})])}}return{...t}}},b=K;n(b,"Model"),"constructor";var f=class{constructor(e){this.setup(e.getInstance())}get ids(){return[...this._models.keys()]}get indexes(){return this._index.indexes}get models(){return this._models}static make(e){return new f(e)}addIndex(e,t,r){this._index.addValue(e,t,r)}all(){let e=[...this._models.values()],t=e.length,r=new c;for(let s=0;s<t;s+=1e4)r.push(...e.slice(s,s+1e4));return r}allModels(){return this.models}delete(e){if(!this._models.has(e))throw new Error("Record doesn't exists");this._index.removeValueByModel(this.findOne(e)),this._models.delete(e)}find(e){let t=this._primaryKeyFieldNames.length>1;return Array.isArray(e)?t?this.findCollectionComposedPrimaryKey(e):this.findCollection(e):t?this.findOneComposedPrimaryKey(e):this.findOne(e)}getIndexByKey(e){return this._index.getIndexByKey(e)}insert(e){if(this._models.has(e.primaryKey))throw new Error("Record already exists");if(!(e instanceof b))throw new Error("Record should be instance of model");e.resetDirty(),e.primaryKey!=null&&this._models.set(e.primaryKey,e),this._index.addValueByModel(e)}registerIndex(e){this._index.register(e)}removeIndex(e,t,r){this._index.removeValue(e,t,r)}select(e){if(!this._models.has(e))throw new Error("Record doesn't exists");return this.find(e)}setupIndexes(){this._model.tableSetup(this)}truncate(){this._models.clear(),this._index.truncate()}update(e){if(!this.models.has(e.primaryKey))throw new Error("Record doesn't exists");if(!(e instanceof b))throw new Error("Record should be instance of model");this._index.removeValueByModel(e),e.resetDirty(),this._index.addValueByModel(e),this._models.set(e.primaryKey,e)}findCollection(e){let t=[];for(let r=0;r<e.length;r++)t.push(this._models.get(e[r]));return new c(...t)}findCollectionComposedPrimaryKey(e){let t=[];for(let r=0;r<e.length;r++)t.push(this._models.get(this.toComposedKey(e[r])));return new c(...t)}findOne(e){var t;return(t=this._models.get(e))!=null?t:null}findOneComposedPrimaryKey(e){var t;return(t=this._models.get(this.toComposedKey(e)))!=null?t:null}setup(e){this.name=e.className,this._primaryKeyFieldNames=e.primaryKeyName,this._model=e,this._models=new Map,this._index=new m}toComposedKey(e){var r;if(typeof e=="string")return e;if(e===null)return null;let t=[];for(let s=0;s<this._primaryKeyFieldNames.length;s++)t.push((r=e[this._primaryKeyFieldNames[s]])!=null?r:"");return t.join("-")}};n(f,"Table");var P=class{constructor(e,t){this._name=e,this._tables=new Map,t.forEach(r=>{this.register(r)})}get name(){return this._name}addIndex(e,t,r,s){this.table(e).addIndex(t,r,s)}all(e){return this.table(e).all()}allModels(e){return this.table(e).allModels()}delete(e,t){this.table(e).delete(t)}drop(e){this._tables.delete(e)}find(e,t){return this.table(e).find(t)}getIndexByKey(e,t){return this.table(e).getIndexByKey(t)}ids(e){return this.table(e).ids}indexes(e){return this.table(e).indexes}insert(e,t){this.table(e).insert(t)}query(e){let t=e.match(/^((SELECT)|(INSERT)|(DELETE))\s+(.*)\s+FROM\s+([^\s]+)(\s+WHERE\s+([^\s]+)\s+(=)\s+([^\s+]))?((\s+)|;)?$/i);if(t.length===0)return null;let r=t[1],s=t[6],i=t[8],a=t[10];return i==="id"?this[r.toLowerCase()](s,a):i===void 0&&r==="SELECT"?this.all(s):null}register(e){let t=new f(e);this._tables.set(t.name,t)}registerIndex(e,t){this.table(e).registerIndex(t)}removeIndex(e,t,r,s){this.table(e).removeIndex(t,r,s)}select(e,t){return this.table(e).select(t)}setIndexes(){this._tables.forEach(e=>{e.setupIndexes()})}showTables(){return[...this._tables.keys()]}truncate(e){this.table(e).truncate()}update(e,t){this.table(e).update(t)}table(e){return this._tables.get(e)}};n(P,"Database");var o=class{constructor(e,t,r){this.model=e,this.action=t,this.data=r,this.callback=()=>null}addCallback(e){this.callback=e}execute(){this.model[this.action](this.data),this.callback()}};n(o,"QueueMessage");var g=class{constructor(e){this.connectionRequestSettings=e}all(e){return fetch(`${this.modelApiLocation(e)}`,{method:"GET",...this.connectionRequestSettings.getSettings()})}delete(e){return fetch(`${this.modelApiLocation(e)}/${e.primaryKey}`,{method:"DELETE",...this.connectionRequestSettings.getSettings()})}get(e){return fetch(`${this.modelApiLocation(e)}/${e.primaryKey}`,{method:"GET",...this.connectionRequestSettings.getSettings()})}modelApiLocation(e){return`${this.connectionRequestSettings.getBaseUrl()}/${e.kebabCaseClassName}`}patch(e){return fetch(`${this.modelApiLocation(e)}/${e.primaryKey}`,{method:"PATCH",body:JSON.stringify(e.dirtyFields),...this.connectionRequestSettings.getSettings()})}post(e){return fetch(this.modelApiLocation(e),{method:"POST",body:e.jsonStringify(),...this.connectionRequestSettings.getSettings()})}put(e){return fetch(`${this.modelApiLocation(e)}/`,{method:"PUT",body:e.jsonStringify(),...this.connectionRequestSettings.getSettings()})}};n(g,"ConnectionRequest");var I=class{constructor(e){this.connectionSettings=e}get isLocal(){return!1}get isRemote(){return!0}all(e){return new Promise(t=>{new g(this.connectionSettings).all(e).then(r=>this.responseJson(r)).then(r=>{let s=new o(e,"insert",r);t(s)})})}delete(e){return new Promise(t=>{new g(this.connectionSettings).delete(e).then(r=>this.responseJson(r)).then(r=>{let s=new o(e,"delete",r);t(s)})})}get(e){return new Promise(t=>{new g(this.connectionSettings).get(e).then(r=>this.responseJson(r)).then(r=>{let s=new o(e,"fill",r);t(s)})})}load(e){return this.all(e)}patch(e){return new Promise(t=>{new g(this.connectionSettings).patch(e).then(r=>this.responseJson(r)).then(r=>{let s=new o(e,"fill",r);t(s)})})}post(e){return new Promise(t=>{new g(this.connectionSettings).post(e).then(r=>this.responseJson(r)).then(r=>{let s=new o(e,"fill",r);t(s)})})}put(e){return new Promise(t=>{new g(this.connectionSettings).put(e).then(r=>this.responseJson(r)).then(r=>{let s=new o(e,"fill",r);t(s)})})}responseJson(e){return e.json()}};n(I,"JsonRequestAdapter");var x=class{constructor(e){this.connectionSettings=e}all(e){return Promise.resolve(new o(e,"aSyncUpdate",this.getTableFromLocalStorage(e)))}delete(e){return Promise.resolve(new o(e,"aSyncUpdate",this.getTableFromLocalStorage(e)))}get(e){return Promise.resolve(new o(e,"aSyncUpdate",this.getTableFromLocalStorage(e)))}load(e){return Promise.resolve(new o(e,"aSyncInsert",this.getTableFromLocalStorage(e)))}patch(e){return Promise.resolve(new o(e,"aSyncUpdate",this.getTableFromLocalStorage(e)))}post(e){return Promise.resolve(new o(e,"aSyncInsert",this.getTableFromLocalStorage(e)))}put(e){return Promise.resolve(new o(e,"aSyncUpdate",this.getTableFromLocalStorage(e)))}getLocalStorageKey(e){return`jeloquent-${globalThis.Store.useDatabase}-${e.className}`}getTableFromLocalStorage(e){var t;return JSON.parse((t=localStorage.getItem(this.getLocalStorageKey(e)))!=null?t:"[]")}};n(x,"LocalStorageAdapter");var F=class{constructor(e){this.connectionSettings=e}all(e){return new Promise(t=>{t(new o(e,"insert",this.options[e.className]))})}delete(e){return new Promise(t=>{t(new o(e,"insert",this.options[e.className]))})}get(e){return new Promise(t=>{t(new o(e,"insert",this.options[e.className]))})}load(e){return new Promise(t=>{t(new o(e,"insert",this.options[e.className]))})}patch(e){return new Promise(t=>{t(new o(e,"insert",this.options[e.className]))})}post(e){return new Promise(t=>{t(new o(e,"insert",this.options[e.className]))})}put(e){return new Promise(t=>{t(new o(e,"insert",this.options[e.className]))})}};n(F,"LocalArrayAdapter");var _=class{static getAdapter(e,t){return e==="jsonRequest"?new I(t):e==="localStorage"?new x(t):e==="localArray"?new F(t):new I(t)}};n(_,"ConnectionAdapterFactory");var $=class{constructor(e,t){let r,s;e instanceof String?s=e:r=e,this.adapter=r!=null?r:_.getAdapter(s,t),this._updateQueue=[],this.paused=!1}all(e){return new Promise(t=>{this.adapter.all(e).then(r=>{this.handleQueueMessage(r,t)})})}delete(e){return new Promise(t=>{this.adapter.delete(e).then(r=>{this.handleQueueMessage(r,t)})})}load(e){return this.all(e)}patch(e){return new Promise(t=>{this.adapter.patch(e).then(r=>{this.handleQueueMessage(r,t)})})}pause(){this.paused=!0}post(e){return new Promise(t=>{this.adapter.post(e).then(r=>{this.handleQueueMessage(r,t)})})}put(e){return new Promise(t=>{this.adapter.put(e).then(r=>{this.handleQueueMessage(r,t)})})}resume(){this.paused=!1}addToQueue(...e){this._updateQueue.push(...e)}handleQueueMessage(e,t){e.addCallback(t),this.addToQueue(e),queueMicrotask(()=>{this.processQueue()})}processQueue(){var t;let e=((t=this._updateQueue)!=null?t:[]).shift();!e||(e.execute(),queueMicrotask(()=>{this.processQueue()}))}};n($,"Connection");var k=class{constructor(){this.classInstances={},this.databases=new Map,this.connections=new Map,this.numberOfModelCreated=0,this.useDatabase="default",this.useConnectionName="default",globalThis.Store=this}add(e){this.databases.set(e.name,e)}addConnection(e,t="default"){this.connections.set(t,e)}connection(){var e;return(e=this.connections.get(this.useConnectionName))!=null?e:null}database(){var e;return(e=this.databases.get(this.useDatabase))!=null?e:null}use(e="default"){var t;this.useDatabase=e,(t=this.databases.get(this.useDatabase))==null||t.setIndexes()}useConnection(e="default"){this.useConnectionName=e}useConnections(e){this.useConnection(e)}};n(k,"Store");export{S as BelongsTo,c as Collection,$ as Connection,_ as ConnectionAdapterFactory,P as Database,d as Field,h as ForeignKey,M as HasMany,y as HasManyThrough,N as HasOne,C as HasOneThrough,b as Model,v as MorphOne,w as MorphTo,o as QueueMessage,l as Relation,k as Store,f as Table};
