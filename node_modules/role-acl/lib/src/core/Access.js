"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./../utils/");
/**
 *  Represents the inner `Access` class that helps build an access information
 *  to be granted or denied; and finally commits it to the underlying grants
 *  model. You can get a first instance of this class by calling
 *  `AccessControl#grant()` or `AccessControl#deny()` methods.
 *  @class
 *  @inner
 *  @memberof AccessControl
 */
var Access = /** @class */ (function () {
    /**
     *  Initializes a new instance of `Access`.
     *  @private
     *
     *  @param {Any} grants
     *         Main grants object.
     *  @param {String|Array<String>|IAccessInfo} roleOrInfo
     *         Either an `IAccessInfo` object, a single or an array of
     *         roles. If an object is passed and attributes
     *         properties are optional. CAUTION: if attributes is omitted,
     *         and access is not denied, it will default to `["*"]` which means
     *         "all attributes allowed".
     *  @param {Boolean} denied
     *         Specifies whether this `Access` is denied.
     */
    function Access(grants, roleOrInfo) {
        /**
         *  Inner `IAccessInfo` object.
         *  @protected
         *  @type {IAccessInfo}
         */
        this._ = {};
        this._grants = grants;
        if (typeof roleOrInfo === 'string' || Array.isArray(roleOrInfo)) {
            this.role(roleOrInfo);
        }
        else if (utils_1.CommonUtil.type(roleOrInfo) === 'object') {
            // if an IAccessInfo instance is passed and it has 'action' defined, we
            // should directly commit it to grants.
            this._ = roleOrInfo;
        }
        if (utils_1.CommonUtil.isInfoFulfilled(this._)) {
            utils_1.CommonUtil.commitToGrants(grants, this._);
        }
    }
    // -------------------------------
    //  PUBLIC METHODS
    // -------------------------------
    /**
     *  A chainer method that sets the role(s) for this `Access` instance.
     *  @param {String|Array<String>} value
     *         A single or array of roles.
     *  @returns {Access}
     *           Self instance of `Access`.
     */
    Access.prototype.role = function (value) {
        this._.role = value;
        return this;
    };
    /**
     *  A chainer method that sets the resource for this `Access` instance.
     *  @param {String|Array<String>} value
     *         Target resource for this `Access` instance.
     *  @returns {Access}
     *           Self instance of `Access`.
     */
    Access.prototype.resource = function (value) {
        this._.resource = value;
        return this;
    };
    /**
     * Commits the grant
    *  @returns {Access}
     *           Self instance of `Access`.
     */
    Access.prototype.commit = function () {
        utils_1.CommonUtil.commitToGrants(this._grants, this._);
        return this;
    };
    /**
     *  Sets the resource and commits the
     *  current access instance to the underlying grant model.
     *
     *  @param {String|Array<String>} [resource]
     *         Defines the target resource this access is granted or denied for.
     *         This is only optional if the resource is previously defined.
     *         If not defined and omitted, this will throw.
     *  @param {String|Array<String>} [attributes]
     *         Defines the resource attributes for which the access is granted
     *         for. If granted before via `.grant()`, this will default
     *         to `["*"]` (which means all attributes allowed.)
     *
     *  @throws {AccessControlError}
     *          If the access instance to be committed has any invalid
     *  data.
     *
     *  @returns {Access}
     *           Self instance of `Access` so that you can chain and define
     *           another access instance to be committed.
     */
    Access.prototype.on = function (resource, attributes) {
        return this._prepareAndCommit(this._.action, resource, attributes);
    };
    /**
     *  Sets the array of allowed attributes for this `Access` instance.
     *  @param {String|Array<String>} value
     *         Attributes to be set.
     *  @returns {Access}
     *           Self instance of `Access`.
     */
    Access.prototype.attributes = function (value) {
        this._.attributes = value;
        return this;
    };
    /**
     *  Sets condition for this `Access` instance.
     *  @param {ICondition} value
     *         Conditions to be set.
     *  @returns {Access}
     *           Self instance of `Access`.
     */
    Access.prototype.condition = function (value) {
        this._.condition = value;
        return this;
    };
    /**
     *  Sets the roles to be extended for this `Access` instance.
     *  @param {String|Array<String>} roles
     *         A single or array of roles.
     *  @returns {Access}
     *           Self instance of `Access`.
     */
    Access.prototype.extend = function (roles) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, utils_1.CommonUtil.extendRole(this._grants, this._.role, roles)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this];
                }
            });
        });
    };
    /**
     *  Sets the roles to be extended for this `Access` instance.
     *  @param {String|Array<String>} roles
     *         A single or array of roles.
     *  @returns {Access}
     *           Self instance of `Access`.
     */
    Access.prototype.extendSync = function (roles) {
        utils_1.CommonUtil.extendRoleSync(this._grants, this._.role, roles);
        return this;
    };
    /**
     *  Shorthand to switch to a new `Access` instance with a different role
     *  within the method chain.
     *
     *  @param {String|Array<String>|IAccessInfo} [roleOrInfo]
     *         Either a single or an array of roles or an
     *         {@link ?api=ac#AccessControl~IAccessInfo|`IAccessInfo` object}.
     *
     *  @returns {Access}
     *           A new `Access` instance.
     *
     *  @example
     *  ac.grant('user').createOwn('video')
     *    .grant('admin').updateAny('video');
     */
    Access.prototype.grant = function (roleOrInfo) {
        return (new Access(this._grants, roleOrInfo)).attributes(['*']);
    };
    /**
     *  Sets the action.
     *
     *  @param {String} action
     *         Defines the action this access is granted for.
     *
     *  @returns {Access}
     *           Self instance of `Access` so that you can chain and define
     *           another access instance to be committed.
     */
    Access.prototype.execute = function (action) {
        this._.action = action;
        return this;
    };
    /**
     * Alias of `execute`
     */
    Access.prototype.action = function (action) {
        this._.action = action;
        return this;
    };
    /**
     *  Sets the condition for access.
     *
     *  @param {String} condition
     *         Defines the action this access is granted for.
     *
     *  @returns {Access}
     *           Self instance of `Access` so that you can chain and define
     *           another access instance to be committed.
     */
    Access.prototype.when = function (condition) {
        this._.condition = condition;
        return this;
    };
    // -------------------------------
    //  PRIVATE METHODS
    // -------------------------------
    /**
     *  @private
     *  @param {String} action     [description]
     *  @param {String|Array<String>} resource   [description]
     *  @param {String|Array<String>} attributes [description]
     *  @returns {Access}
     *           Self instance of `Access`.
     */
    Access.prototype._prepareAndCommit = function (action, resource, attributes) {
        this._.action = action;
        if (resource)
            this._.resource = resource;
        if (attributes)
            this._.attributes = attributes;
        utils_1.CommonUtil.commitToGrants(this._grants, this._);
        // important: reset attributes for chained methods
        this._.attributes = undefined;
        return this;
    };
    return Access;
}());
exports.Access = Access;
