var MainExport = (() => {
    var _scriptName = import.meta.url;

    return function (moduleArg = {}) {
        var moduleRtn;

        var Module = moduleArg;
        var readyPromiseResolve, readyPromiseReject;
        var readyPromise = new Promise((resolve, reject) => {
            readyPromiseResolve = resolve;
            readyPromiseReject = reject;
        });
        var ENVIRONMENT_IS_WEB = true;
        var ENVIRONMENT_IS_WORKER = false;
        var moduleOverrides = Object.assign({}, Module);
        var arguments_ = [];
        var thisProgram = "./this.program";
        var quit_ = (status, toThrow) => {
            throw toThrow;
        };
        var scriptDirectory = "";
        function locateFile(path) {
            if (Module["locateFile"]) {
                return Module["locateFile"](path, scriptDirectory);
            }
            return scriptDirectory + path;
        }
        var readAsync, readBinary;
        if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
            if (ENVIRONMENT_IS_WORKER) {
                scriptDirectory = self.location.href;
            } else if (typeof document != "undefined" && document.currentScript) {
                scriptDirectory = document.currentScript.src;
            }
            if (_scriptName) {
                scriptDirectory = _scriptName;
            }
            if (scriptDirectory.startsWith("blob:")) {
                scriptDirectory = "";
            } else {
                scriptDirectory = scriptDirectory.substr(
                    0,
                    scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1,
                );
            }
            {
                readAsync = (url) =>
                    fetch(url, { credentials: "same-origin" }).then((response) => {
                        if (response.ok) {
                            return response.arrayBuffer();
                        }
                        return Promise.reject(new Error(response.status + " : " + response.url));
                    });
            }
        } else {
        }
        var out = Module["print"] || console.log.bind(console);
        var err = Module["printErr"] || console.error.bind(console);
        Object.assign(Module, moduleOverrides);
        moduleOverrides = null;
        if (Module["arguments"]) arguments_ = Module["arguments"];
        if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
        var wasmBinary = Module["wasmBinary"];
        var wasmMemory;
        var ABORT = false;
        var EXITSTATUS;
        var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAP64, HEAPU64, HEAPF64;
        function updateMemoryViews() {
            var b = wasmMemory.buffer;
            Module["HEAP8"] = HEAP8 = new Int8Array(b);
            Module["HEAP16"] = HEAP16 = new Int16Array(b);
            Module["HEAPU8"] = HEAPU8 = new Uint8Array(b);
            Module["HEAPU16"] = HEAPU16 = new Uint16Array(b);
            Module["HEAP32"] = HEAP32 = new Int32Array(b);
            Module["HEAPU32"] = HEAPU32 = new Uint32Array(b);
            Module["HEAPF32"] = HEAPF32 = new Float32Array(b);
            Module["HEAPF64"] = HEAPF64 = new Float64Array(b);
            Module["HEAP64"] = HEAP64 = new BigInt64Array(b);
            Module["HEAPU64"] = HEAPU64 = new BigUint64Array(b);
        }
        var __ATPRERUN__ = [];
        var __ATINIT__ = [];
        var __ATPOSTRUN__ = [];
        var runtimeInitialized = false;
        function preRun() {
            if (Module["preRun"]) {
                if (typeof Module["preRun"] == "function") Module["preRun"] = [Module["preRun"]];
                while (Module["preRun"].length) {
                    addOnPreRun(Module["preRun"].shift());
                }
            }
            callRuntimeCallbacks(__ATPRERUN__);
        }
        function initRuntime() {
            runtimeInitialized = true;
            if (!Module["noFSInit"] && !FS.initialized) FS.init();
            FS.ignorePermissions = false;
            TTY.init();
            callRuntimeCallbacks(__ATINIT__);
        }
        function postRun() {
            if (Module["postRun"]) {
                if (typeof Module["postRun"] == "function") Module["postRun"] = [Module["postRun"]];
                while (Module["postRun"].length) {
                    addOnPostRun(Module["postRun"].shift());
                }
            }
            callRuntimeCallbacks(__ATPOSTRUN__);
        }
        function addOnPreRun(cb) {
            __ATPRERUN__.unshift(cb);
        }
        function addOnInit(cb) {
            __ATINIT__.unshift(cb);
        }
        function addOnPostRun(cb) {
            __ATPOSTRUN__.unshift(cb);
        }
        var runDependencies = 0;
        var runDependencyWatcher = null;
        var dependenciesFulfilled = null;
        function getUniqueRunDependency(id) {
            return id;
        }
        function addRunDependency(id) {
            runDependencies++;
            Module["monitorRunDependencies"]?.(runDependencies);
        }
        function removeRunDependency(id) {
            runDependencies--;
            Module["monitorRunDependencies"]?.(runDependencies);
            if (runDependencies == 0) {
                if (runDependencyWatcher !== null) {
                    clearInterval(runDependencyWatcher);
                    runDependencyWatcher = null;
                }
                if (dependenciesFulfilled) {
                    var callback = dependenciesFulfilled;
                    dependenciesFulfilled = null;
                    callback();
                }
            }
        }
        function abort(what) {
            Module["onAbort"]?.(what);
            what = "Aborted(" + what + ")";
            err(what);
            ABORT = true;
            what += ". Build with -sASSERTIONS for more info.";
            var e = new WebAssembly.RuntimeError(what);
            readyPromiseReject(e);
            throw e;
        }
        var dataURIPrefix = "data:application/octet-stream;base64,";
        var isDataURI = (filename) => filename.startsWith(dataURIPrefix);
        function findWasmBinary() {
            if (Module["locateFile"]) {
                var f = "jsimgui-em.wasm";
                if (!isDataURI(f)) {
                    return locateFile(f);
                }
                return f;
            }
            return new URL("jsimgui-em.wasm", import.meta.url).href;
        }
        var wasmBinaryFile;
        function getBinarySync(file) {
            if (file == wasmBinaryFile && wasmBinary) {
                return new Uint8Array(wasmBinary);
            }
            if (readBinary) {
                return readBinary(file);
            }
            throw "both async and sync fetching of the wasm failed";
        }
        function getBinaryPromise(binaryFile) {
            if (!wasmBinary) {
                return readAsync(binaryFile).then(
                    (response) => new Uint8Array(response),
                    () => getBinarySync(binaryFile),
                );
            }
            return Promise.resolve().then(() => getBinarySync(binaryFile));
        }
        function instantiateArrayBuffer(binaryFile, imports, receiver) {
            return getBinaryPromise(binaryFile)
                .then((binary) => WebAssembly.instantiate(binary, imports))
                .then(receiver, (reason) => {
                    err(`failed to asynchronously prepare wasm: ${reason}`);
                    abort(reason);
                });
        }
        function instantiateAsync(binary, binaryFile, imports, callback) {
            if (
                !binary &&
                typeof WebAssembly.instantiateStreaming == "function" &&
                !isDataURI(binaryFile) &&
                typeof fetch == "function"
            ) {
                return fetch(binaryFile, { credentials: "same-origin" }).then((response) => {
                    var result = WebAssembly.instantiateStreaming(response, imports);
                    return result.then(callback, function (reason) {
                        err(`wasm streaming compile failed: ${reason}`);
                        err("falling back to ArrayBuffer instantiation");
                        return instantiateArrayBuffer(binaryFile, imports, callback);
                    });
                });
            }
            return instantiateArrayBuffer(binaryFile, imports, callback);
        }
        function getWasmImports() {
            return { a: wasmImports };
        }
        function createWasm() {
            function receiveInstance(instance, module) {
                wasmExports = instance.exports;
                wasmMemory = wasmExports["Ga"];
                updateMemoryViews();
                wasmTable = wasmExports["La"];
                addOnInit(wasmExports["Ha"]);
                removeRunDependency("wasm-instantiate");
                return wasmExports;
            }
            addRunDependency("wasm-instantiate");
            function receiveInstantiationResult(result) {
                receiveInstance(result["instance"]);
            }
            var info = getWasmImports();
            if (Module["instantiateWasm"]) {
                try {
                    return Module["instantiateWasm"](info, receiveInstance);
                } catch (e) {
                    err(`Module.instantiateWasm callback failed with error: ${e}`);
                    readyPromiseReject(e);
                }
            }
            wasmBinaryFile ??= findWasmBinary();
            instantiateAsync(wasmBinary, wasmBinaryFile, info, receiveInstantiationResult).catch(
                readyPromiseReject,
            );
            return {};
        }
        class ExitStatus {
            name = "ExitStatus";
            constructor(status) {
                this.message = `Program terminated with exit(${status})`;
                this.status = status;
            }
        }
        var callRuntimeCallbacks = (callbacks) => {
            while (callbacks.length > 0) {
                callbacks.shift()(Module);
            }
        };
        var noExitRuntime = Module["noExitRuntime"] || true;
        var UTF8Decoder = typeof TextDecoder != "undefined" ? new TextDecoder() : undefined;
        var UTF8ArrayToString = (heapOrArray, idx = 0, maxBytesToRead = NaN) => {
            var endIdx = idx + maxBytesToRead;
            var endPtr = idx;
            while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr;
            if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
                return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
            }
            var str = "";
            while (idx < endPtr) {
                var u0 = heapOrArray[idx++];
                if (!(u0 & 128)) {
                    str += String.fromCharCode(u0);
                    continue;
                }
                var u1 = heapOrArray[idx++] & 63;
                if ((u0 & 224) == 192) {
                    str += String.fromCharCode(((u0 & 31) << 6) | u1);
                    continue;
                }
                var u2 = heapOrArray[idx++] & 63;
                if ((u0 & 240) == 224) {
                    u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
                } else {
                    u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heapOrArray[idx++] & 63);
                }
                if (u0 < 65536) {
                    str += String.fromCharCode(u0);
                } else {
                    var ch = u0 - 65536;
                    str += String.fromCharCode(55296 | (ch >> 10), 56320 | (ch & 1023));
                }
            }
            return str;
        };
        var UTF8ToString = (ptr, maxBytesToRead) =>
            ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
        var ___assert_fail = (condition, filename, line, func) => {
            abort(
                `Assertion failed: ${UTF8ToString(condition)}, at: ` +
                    [
                        filename ? UTF8ToString(filename) : "unknown filename",
                        line,
                        func ? UTF8ToString(func) : "unknown function",
                    ],
            );
        };
        class ExceptionInfo {
            constructor(excPtr) {
                this.excPtr = excPtr;
                this.ptr = excPtr - 24;
            }
            set_type(type) {
                HEAPU32[(this.ptr + 4) >> 2] = type;
            }
            get_type() {
                return HEAPU32[(this.ptr + 4) >> 2];
            }
            set_destructor(destructor) {
                HEAPU32[(this.ptr + 8) >> 2] = destructor;
            }
            get_destructor() {
                return HEAPU32[(this.ptr + 8) >> 2];
            }
            set_caught(caught) {
                caught = caught ? 1 : 0;
                HEAP8[this.ptr + 12] = caught;
            }
            get_caught() {
                return HEAP8[this.ptr + 12] != 0;
            }
            set_rethrown(rethrown) {
                rethrown = rethrown ? 1 : 0;
                HEAP8[this.ptr + 13] = rethrown;
            }
            get_rethrown() {
                return HEAP8[this.ptr + 13] != 0;
            }
            init(type, destructor) {
                this.set_adjusted_ptr(0);
                this.set_type(type);
                this.set_destructor(destructor);
            }
            set_adjusted_ptr(adjustedPtr) {
                HEAPU32[(this.ptr + 16) >> 2] = adjustedPtr;
            }
            get_adjusted_ptr() {
                return HEAPU32[(this.ptr + 16) >> 2];
            }
        }
        var exceptionLast = 0;
        var uncaughtExceptionCount = 0;
        var ___cxa_throw = (ptr, type, destructor) => {
            var info = new ExceptionInfo(ptr);
            info.init(type, destructor);
            exceptionLast = ptr;
            uncaughtExceptionCount++;
            throw exceptionLast;
        };
        var syscallGetVarargI = () => {
            var ret = HEAP32[+SYSCALLS.varargs >> 2];
            SYSCALLS.varargs += 4;
            return ret;
        };
        var syscallGetVarargP = syscallGetVarargI;
        var PATH = {
            isAbs: (path) => path.charAt(0) === "/",
            splitPath: (filename) => {
                var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
                return splitPathRe.exec(filename).slice(1);
            },
            normalizeArray: (parts, allowAboveRoot) => {
                var up = 0;
                for (var i = parts.length - 1; i >= 0; i--) {
                    var last = parts[i];
                    if (last === ".") {
                        parts.splice(i, 1);
                    } else if (last === "..") {
                        parts.splice(i, 1);
                        up++;
                    } else if (up) {
                        parts.splice(i, 1);
                        up--;
                    }
                }
                if (allowAboveRoot) {
                    for (; up; up--) {
                        parts.unshift("..");
                    }
                }
                return parts;
            },
            normalize: (path) => {
                var isAbsolute = PATH.isAbs(path),
                    trailingSlash = path.substr(-1) === "/";
                path = PATH.normalizeArray(
                    path.split("/").filter((p) => !!p),
                    !isAbsolute,
                ).join("/");
                if (!path && !isAbsolute) {
                    path = ".";
                }
                if (path && trailingSlash) {
                    path += "/";
                }
                return (isAbsolute ? "/" : "") + path;
            },
            dirname: (path) => {
                var result = PATH.splitPath(path),
                    root = result[0],
                    dir = result[1];
                if (!root && !dir) {
                    return ".";
                }
                if (dir) {
                    dir = dir.substr(0, dir.length - 1);
                }
                return root + dir;
            },
            basename: (path) => {
                if (path === "/") return "/";
                path = PATH.normalize(path);
                path = path.replace(/\/$/, "");
                var lastSlash = path.lastIndexOf("/");
                if (lastSlash === -1) return path;
                return path.substr(lastSlash + 1);
            },
            join: (...paths) => PATH.normalize(paths.join("/")),
            join2: (l, r) => PATH.normalize(l + "/" + r),
        };
        var initRandomFill = () => {
            if (typeof crypto == "object" && typeof crypto["getRandomValues"] == "function") {
                return (view) => crypto.getRandomValues(view);
            } else abort("initRandomDevice");
        };
        var randomFill = (view) => (randomFill = initRandomFill())(view);
        var PATH_FS = {
            resolve: (...args) => {
                var resolvedPath = "",
                    resolvedAbsolute = false;
                for (var i = args.length - 1; i >= -1 && !resolvedAbsolute; i--) {
                    var path = i >= 0 ? args[i] : FS.cwd();
                    if (typeof path != "string") {
                        throw new TypeError("Arguments to path.resolve must be strings");
                    } else if (!path) {
                        return "";
                    }
                    resolvedPath = path + "/" + resolvedPath;
                    resolvedAbsolute = PATH.isAbs(path);
                }
                resolvedPath = PATH.normalizeArray(
                    resolvedPath.split("/").filter((p) => !!p),
                    !resolvedAbsolute,
                ).join("/");
                return (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
            },
            relative: (from, to) => {
                from = PATH_FS.resolve(from).substr(1);
                to = PATH_FS.resolve(to).substr(1);
                function trim(arr) {
                    var start = 0;
                    for (; start < arr.length; start++) {
                        if (arr[start] !== "") break;
                    }
                    var end = arr.length - 1;
                    for (; end >= 0; end--) {
                        if (arr[end] !== "") break;
                    }
                    if (start > end) return [];
                    return arr.slice(start, end - start + 1);
                }
                var fromParts = trim(from.split("/"));
                var toParts = trim(to.split("/"));
                var length = Math.min(fromParts.length, toParts.length);
                var samePartsLength = length;
                for (var i = 0; i < length; i++) {
                    if (fromParts[i] !== toParts[i]) {
                        samePartsLength = i;
                        break;
                    }
                }
                var outputParts = [];
                for (var i = samePartsLength; i < fromParts.length; i++) {
                    outputParts.push("..");
                }
                outputParts = outputParts.concat(toParts.slice(samePartsLength));
                return outputParts.join("/");
            },
        };
        var FS_stdin_getChar_buffer = [];
        var lengthBytesUTF8 = (str) => {
            var len = 0;
            for (var i = 0; i < str.length; ++i) {
                var c = str.charCodeAt(i);
                if (c <= 127) {
                    len++;
                } else if (c <= 2047) {
                    len += 2;
                } else if (c >= 55296 && c <= 57343) {
                    len += 4;
                    ++i;
                } else {
                    len += 3;
                }
            }
            return len;
        };
        var stringToUTF8Array = (str, heap, outIdx, maxBytesToWrite) => {
            if (!(maxBytesToWrite > 0)) return 0;
            var startIdx = outIdx;
            var endIdx = outIdx + maxBytesToWrite - 1;
            for (var i = 0; i < str.length; ++i) {
                var u = str.charCodeAt(i);
                if (u >= 55296 && u <= 57343) {
                    var u1 = str.charCodeAt(++i);
                    u = (65536 + ((u & 1023) << 10)) | (u1 & 1023);
                }
                if (u <= 127) {
                    if (outIdx >= endIdx) break;
                    heap[outIdx++] = u;
                } else if (u <= 2047) {
                    if (outIdx + 1 >= endIdx) break;
                    heap[outIdx++] = 192 | (u >> 6);
                    heap[outIdx++] = 128 | (u & 63);
                } else if (u <= 65535) {
                    if (outIdx + 2 >= endIdx) break;
                    heap[outIdx++] = 224 | (u >> 12);
                    heap[outIdx++] = 128 | ((u >> 6) & 63);
                    heap[outIdx++] = 128 | (u & 63);
                } else {
                    if (outIdx + 3 >= endIdx) break;
                    heap[outIdx++] = 240 | (u >> 18);
                    heap[outIdx++] = 128 | ((u >> 12) & 63);
                    heap[outIdx++] = 128 | ((u >> 6) & 63);
                    heap[outIdx++] = 128 | (u & 63);
                }
            }
            heap[outIdx] = 0;
            return outIdx - startIdx;
        };
        function intArrayFromString(stringy, dontAddNull, length) {
            var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
            var u8array = new Array(len);
            var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
            if (dontAddNull) u8array.length = numBytesWritten;
            return u8array;
        }
        var FS_stdin_getChar = () => {
            if (!FS_stdin_getChar_buffer.length) {
                var result = null;
                if (typeof window != "undefined" && typeof window.prompt == "function") {
                    result = window.prompt("Input: ");
                    if (result !== null) {
                        result += "\n";
                    }
                } else {
                }
                if (!result) {
                    return null;
                }
                FS_stdin_getChar_buffer = intArrayFromString(result, true);
            }
            return FS_stdin_getChar_buffer.shift();
        };
        var TTY = {
            ttys: [],
            init() {},
            shutdown() {},
            register(dev, ops) {
                TTY.ttys[dev] = { input: [], output: [], ops };
                FS.registerDevice(dev, TTY.stream_ops);
            },
            stream_ops: {
                open(stream) {
                    var tty = TTY.ttys[stream.node.rdev];
                    if (!tty) {
                        throw new FS.ErrnoError(43);
                    }
                    stream.tty = tty;
                    stream.seekable = false;
                },
                close(stream) {
                    stream.tty.ops.fsync(stream.tty);
                },
                fsync(stream) {
                    stream.tty.ops.fsync(stream.tty);
                },
                read(stream, buffer, offset, length, pos) {
                    if (!stream.tty || !stream.tty.ops.get_char) {
                        throw new FS.ErrnoError(60);
                    }
                    var bytesRead = 0;
                    for (var i = 0; i < length; i++) {
                        var result;
                        try {
                            result = stream.tty.ops.get_char(stream.tty);
                        } catch (e) {
                            throw new FS.ErrnoError(29);
                        }
                        if (result === undefined && bytesRead === 0) {
                            throw new FS.ErrnoError(6);
                        }
                        if (result === null || result === undefined) break;
                        bytesRead++;
                        buffer[offset + i] = result;
                    }
                    if (bytesRead) {
                        stream.node.timestamp = Date.now();
                    }
                    return bytesRead;
                },
                write(stream, buffer, offset, length, pos) {
                    if (!stream.tty || !stream.tty.ops.put_char) {
                        throw new FS.ErrnoError(60);
                    }
                    try {
                        for (var i = 0; i < length; i++) {
                            stream.tty.ops.put_char(stream.tty, buffer[offset + i]);
                        }
                    } catch (e) {
                        throw new FS.ErrnoError(29);
                    }
                    if (length) {
                        stream.node.timestamp = Date.now();
                    }
                    return i;
                },
            },
            default_tty_ops: {
                get_char(tty) {
                    return FS_stdin_getChar();
                },
                put_char(tty, val) {
                    if (val === null || val === 10) {
                        out(UTF8ArrayToString(tty.output));
                        tty.output = [];
                    } else {
                        if (val != 0) tty.output.push(val);
                    }
                },
                fsync(tty) {
                    if (tty.output && tty.output.length > 0) {
                        out(UTF8ArrayToString(tty.output));
                        tty.output = [];
                    }
                },
                ioctl_tcgets(tty) {
                    return {
                        c_iflag: 25856,
                        c_oflag: 5,
                        c_cflag: 191,
                        c_lflag: 35387,
                        c_cc: [
                            3, 28, 127, 21, 4, 0, 1, 0, 17, 19, 26, 0, 18, 15, 23, 22, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        ],
                    };
                },
                ioctl_tcsets(tty, optional_actions, data) {
                    return 0;
                },
                ioctl_tiocgwinsz(tty) {
                    return [24, 80];
                },
            },
            default_tty1_ops: {
                put_char(tty, val) {
                    if (val === null || val === 10) {
                        err(UTF8ArrayToString(tty.output));
                        tty.output = [];
                    } else {
                        if (val != 0) tty.output.push(val);
                    }
                },
                fsync(tty) {
                    if (tty.output && tty.output.length > 0) {
                        err(UTF8ArrayToString(tty.output));
                        tty.output = [];
                    }
                },
            },
        };
        var mmapAlloc = (size) => {
            abort();
        };
        var MEMFS = {
            ops_table: null,
            mount(mount) {
                return MEMFS.createNode(null, "/", 16384 | 511, 0);
            },
            createNode(parent, name, mode, dev) {
                if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
                    throw new FS.ErrnoError(63);
                }
                MEMFS.ops_table ||= {
                    dir: {
                        node: {
                            getattr: MEMFS.node_ops.getattr,
                            setattr: MEMFS.node_ops.setattr,
                            lookup: MEMFS.node_ops.lookup,
                            mknod: MEMFS.node_ops.mknod,
                            rename: MEMFS.node_ops.rename,
                            unlink: MEMFS.node_ops.unlink,
                            rmdir: MEMFS.node_ops.rmdir,
                            readdir: MEMFS.node_ops.readdir,
                            symlink: MEMFS.node_ops.symlink,
                        },
                        stream: { llseek: MEMFS.stream_ops.llseek },
                    },
                    file: {
                        node: { getattr: MEMFS.node_ops.getattr, setattr: MEMFS.node_ops.setattr },
                        stream: {
                            llseek: MEMFS.stream_ops.llseek,
                            read: MEMFS.stream_ops.read,
                            write: MEMFS.stream_ops.write,
                            allocate: MEMFS.stream_ops.allocate,
                            mmap: MEMFS.stream_ops.mmap,
                            msync: MEMFS.stream_ops.msync,
                        },
                    },
                    link: {
                        node: {
                            getattr: MEMFS.node_ops.getattr,
                            setattr: MEMFS.node_ops.setattr,
                            readlink: MEMFS.node_ops.readlink,
                        },
                        stream: {},
                    },
                    chrdev: {
                        node: { getattr: MEMFS.node_ops.getattr, setattr: MEMFS.node_ops.setattr },
                        stream: FS.chrdev_stream_ops,
                    },
                };
                var node = FS.createNode(parent, name, mode, dev);
                if (FS.isDir(node.mode)) {
                    node.node_ops = MEMFS.ops_table.dir.node;
                    node.stream_ops = MEMFS.ops_table.dir.stream;
                    node.contents = {};
                } else if (FS.isFile(node.mode)) {
                    node.node_ops = MEMFS.ops_table.file.node;
                    node.stream_ops = MEMFS.ops_table.file.stream;
                    node.usedBytes = 0;
                    node.contents = null;
                } else if (FS.isLink(node.mode)) {
                    node.node_ops = MEMFS.ops_table.link.node;
                    node.stream_ops = MEMFS.ops_table.link.stream;
                } else if (FS.isChrdev(node.mode)) {
                    node.node_ops = MEMFS.ops_table.chrdev.node;
                    node.stream_ops = MEMFS.ops_table.chrdev.stream;
                }
                node.timestamp = Date.now();
                if (parent) {
                    parent.contents[name] = node;
                    parent.timestamp = node.timestamp;
                }
                return node;
            },
            getFileDataAsTypedArray(node) {
                if (!node.contents) return new Uint8Array(0);
                if (node.contents.subarray) return node.contents.subarray(0, node.usedBytes);
                return new Uint8Array(node.contents);
            },
            expandFileStorage(node, newCapacity) {
                var prevCapacity = node.contents ? node.contents.length : 0;
                if (prevCapacity >= newCapacity) return;
                var CAPACITY_DOUBLING_MAX = 1024 * 1024;
                newCapacity = Math.max(
                    newCapacity,
                    (prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125)) >>> 0,
                );
                if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256);
                var oldContents = node.contents;
                node.contents = new Uint8Array(newCapacity);
                if (node.usedBytes > 0)
                    node.contents.set(oldContents.subarray(0, node.usedBytes), 0);
            },
            resizeFileStorage(node, newSize) {
                if (node.usedBytes == newSize) return;
                if (newSize == 0) {
                    node.contents = null;
                    node.usedBytes = 0;
                } else {
                    var oldContents = node.contents;
                    node.contents = new Uint8Array(newSize);
                    if (oldContents) {
                        node.contents.set(
                            oldContents.subarray(0, Math.min(newSize, node.usedBytes)),
                        );
                    }
                    node.usedBytes = newSize;
                }
            },
            node_ops: {
                getattr(node) {
                    var attr = {};
                    attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
                    attr.ino = node.id;
                    attr.mode = node.mode;
                    attr.nlink = 1;
                    attr.uid = 0;
                    attr.gid = 0;
                    attr.rdev = node.rdev;
                    if (FS.isDir(node.mode)) {
                        attr.size = 4096;
                    } else if (FS.isFile(node.mode)) {
                        attr.size = node.usedBytes;
                    } else if (FS.isLink(node.mode)) {
                        attr.size = node.link.length;
                    } else {
                        attr.size = 0;
                    }
                    attr.atime = new Date(node.timestamp);
                    attr.mtime = new Date(node.timestamp);
                    attr.ctime = new Date(node.timestamp);
                    attr.blksize = 4096;
                    attr.blocks = Math.ceil(attr.size / attr.blksize);
                    return attr;
                },
                setattr(node, attr) {
                    if (attr.mode !== undefined) {
                        node.mode = attr.mode;
                    }
                    if (attr.timestamp !== undefined) {
                        node.timestamp = attr.timestamp;
                    }
                    if (attr.size !== undefined) {
                        MEMFS.resizeFileStorage(node, attr.size);
                    }
                },
                lookup(parent, name) {
                    throw MEMFS.doesNotExistError;
                },
                mknod(parent, name, mode, dev) {
                    return MEMFS.createNode(parent, name, mode, dev);
                },
                rename(old_node, new_dir, new_name) {
                    if (FS.isDir(old_node.mode)) {
                        var new_node;
                        try {
                            new_node = FS.lookupNode(new_dir, new_name);
                        } catch (e) {}
                        if (new_node) {
                            for (var i in new_node.contents) {
                                throw new FS.ErrnoError(55);
                            }
                        }
                    }
                    delete old_node.parent.contents[old_node.name];
                    old_node.parent.timestamp = Date.now();
                    old_node.name = new_name;
                    new_dir.contents[new_name] = old_node;
                    new_dir.timestamp = old_node.parent.timestamp;
                },
                unlink(parent, name) {
                    delete parent.contents[name];
                    parent.timestamp = Date.now();
                },
                rmdir(parent, name) {
                    var node = FS.lookupNode(parent, name);
                    for (var i in node.contents) {
                        throw new FS.ErrnoError(55);
                    }
                    delete parent.contents[name];
                    parent.timestamp = Date.now();
                },
                readdir(node) {
                    var entries = [".", ".."];
                    for (var key of Object.keys(node.contents)) {
                        entries.push(key);
                    }
                    return entries;
                },
                symlink(parent, newname, oldpath) {
                    var node = MEMFS.createNode(parent, newname, 511 | 40960, 0);
                    node.link = oldpath;
                    return node;
                },
                readlink(node) {
                    if (!FS.isLink(node.mode)) {
                        throw new FS.ErrnoError(28);
                    }
                    return node.link;
                },
            },
            stream_ops: {
                read(stream, buffer, offset, length, position) {
                    var contents = stream.node.contents;
                    if (position >= stream.node.usedBytes) return 0;
                    var size = Math.min(stream.node.usedBytes - position, length);
                    if (size > 8 && contents.subarray) {
                        buffer.set(contents.subarray(position, position + size), offset);
                    } else {
                        for (var i = 0; i < size; i++) buffer[offset + i] = contents[position + i];
                    }
                    return size;
                },
                write(stream, buffer, offset, length, position, canOwn) {
                    if (!length) return 0;
                    var node = stream.node;
                    node.timestamp = Date.now();
                    if (buffer.subarray && (!node.contents || node.contents.subarray)) {
                        if (canOwn) {
                            node.contents = buffer.subarray(offset, offset + length);
                            node.usedBytes = length;
                            return length;
                        } else if (node.usedBytes === 0 && position === 0) {
                            node.contents = buffer.slice(offset, offset + length);
                            node.usedBytes = length;
                            return length;
                        } else if (position + length <= node.usedBytes) {
                            node.contents.set(buffer.subarray(offset, offset + length), position);
                            return length;
                        }
                    }
                    MEMFS.expandFileStorage(node, position + length);
                    if (node.contents.subarray && buffer.subarray) {
                        node.contents.set(buffer.subarray(offset, offset + length), position);
                    } else {
                        for (var i = 0; i < length; i++) {
                            node.contents[position + i] = buffer[offset + i];
                        }
                    }
                    node.usedBytes = Math.max(node.usedBytes, position + length);
                    return length;
                },
                llseek(stream, offset, whence) {
                    var position = offset;
                    if (whence === 1) {
                        position += stream.position;
                    } else if (whence === 2) {
                        if (FS.isFile(stream.node.mode)) {
                            position += stream.node.usedBytes;
                        }
                    }
                    if (position < 0) {
                        throw new FS.ErrnoError(28);
                    }
                    return position;
                },
                allocate(stream, offset, length) {
                    MEMFS.expandFileStorage(stream.node, offset + length);
                    stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length);
                },
                mmap(stream, length, position, prot, flags) {
                    if (!FS.isFile(stream.node.mode)) {
                        throw new FS.ErrnoError(43);
                    }
                    var ptr;
                    var allocated;
                    var contents = stream.node.contents;
                    if (!(flags & 2) && contents && contents.buffer === HEAP8.buffer) {
                        allocated = false;
                        ptr = contents.byteOffset;
                    } else {
                        allocated = true;
                        ptr = mmapAlloc(length);
                        if (!ptr) {
                            throw new FS.ErrnoError(48);
                        }
                        if (contents) {
                            if (position > 0 || position + length < contents.length) {
                                if (contents.subarray) {
                                    contents = contents.subarray(position, position + length);
                                } else {
                                    contents = Array.prototype.slice.call(
                                        contents,
                                        position,
                                        position + length,
                                    );
                                }
                            }
                            HEAP8.set(contents, ptr);
                        }
                    }
                    return { ptr, allocated };
                },
                msync(stream, buffer, offset, length, mmapFlags) {
                    MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
                    return 0;
                },
            },
        };
        var asyncLoad = (url, onload, onerror, noRunDep) => {
            var dep = !noRunDep ? getUniqueRunDependency(`al ${url}`) : "";
            readAsync(url).then(
                (arrayBuffer) => {
                    onload(new Uint8Array(arrayBuffer));
                    if (dep) removeRunDependency(dep);
                },
                (err) => {
                    if (onerror) {
                        onerror();
                    } else {
                        throw `Loading data file "${url}" failed.`;
                    }
                },
            );
            if (dep) addRunDependency(dep);
        };
        var FS_createDataFile = (parent, name, fileData, canRead, canWrite, canOwn) => {
            FS.createDataFile(parent, name, fileData, canRead, canWrite, canOwn);
        };
        var preloadPlugins = Module["preloadPlugins"] || [];
        var FS_handledByPreloadPlugin = (byteArray, fullname, finish, onerror) => {
            if (typeof Browser != "undefined") Browser.init();
            var handled = false;
            preloadPlugins.forEach((plugin) => {
                if (handled) return;
                if (plugin["canHandle"](fullname)) {
                    plugin["handle"](byteArray, fullname, finish, onerror);
                    handled = true;
                }
            });
            return handled;
        };
        var FS_createPreloadedFile = (
            parent,
            name,
            url,
            canRead,
            canWrite,
            onload,
            onerror,
            dontCreateFile,
            canOwn,
            preFinish,
        ) => {
            var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
            var dep = getUniqueRunDependency(`cp ${fullname}`);
            function processData(byteArray) {
                function finish(byteArray) {
                    preFinish?.();
                    if (!dontCreateFile) {
                        FS_createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
                    }
                    onload?.();
                    removeRunDependency(dep);
                }
                if (
                    FS_handledByPreloadPlugin(byteArray, fullname, finish, () => {
                        onerror?.();
                        removeRunDependency(dep);
                    })
                ) {
                    return;
                }
                finish(byteArray);
            }
            addRunDependency(dep);
            if (typeof url == "string") {
                asyncLoad(url, processData, onerror);
            } else {
                processData(url);
            }
        };
        var FS_modeStringToFlags = (str) => {
            var flagModes = {
                r: 0,
                "r+": 2,
                w: 512 | 64 | 1,
                "w+": 512 | 64 | 2,
                a: 1024 | 64 | 1,
                "a+": 1024 | 64 | 2,
            };
            var flags = flagModes[str];
            if (typeof flags == "undefined") {
                throw new Error(`Unknown file open mode: ${str}`);
            }
            return flags;
        };
        var FS_getMode = (canRead, canWrite) => {
            var mode = 0;
            if (canRead) mode |= 292 | 73;
            if (canWrite) mode |= 146;
            return mode;
        };
        var FS = {
            root: null,
            mounts: [],
            devices: {},
            streams: [],
            nextInode: 1,
            nameTable: null,
            currentPath: "/",
            initialized: false,
            ignorePermissions: true,
            ErrnoError: class {
                name = "ErrnoError";
                constructor(errno) {
                    this.errno = errno;
                }
            },
            filesystems: null,
            syncFSRequests: 0,
            readFiles: {},
            FSStream: class {
                shared = {};
                get object() {
                    return this.node;
                }
                set object(val) {
                    this.node = val;
                }
                get isRead() {
                    return (this.flags & 2097155) !== 1;
                }
                get isWrite() {
                    return (this.flags & 2097155) !== 0;
                }
                get isAppend() {
                    return this.flags & 1024;
                }
                get flags() {
                    return this.shared.flags;
                }
                set flags(val) {
                    this.shared.flags = val;
                }
                get position() {
                    return this.shared.position;
                }
                set position(val) {
                    this.shared.position = val;
                }
            },
            FSNode: class {
                node_ops = {};
                stream_ops = {};
                readMode = 292 | 73;
                writeMode = 146;
                mounted = null;
                constructor(parent, name, mode, rdev) {
                    if (!parent) {
                        parent = this;
                    }
                    this.parent = parent;
                    this.mount = parent.mount;
                    this.id = FS.nextInode++;
                    this.name = name;
                    this.mode = mode;
                    this.rdev = rdev;
                }
                get read() {
                    return (this.mode & this.readMode) === this.readMode;
                }
                set read(val) {
                    val ? (this.mode |= this.readMode) : (this.mode &= ~this.readMode);
                }
                get write() {
                    return (this.mode & this.writeMode) === this.writeMode;
                }
                set write(val) {
                    val ? (this.mode |= this.writeMode) : (this.mode &= ~this.writeMode);
                }
                get isFolder() {
                    return FS.isDir(this.mode);
                }
                get isDevice() {
                    return FS.isChrdev(this.mode);
                }
            },
            lookupPath(path, opts = {}) {
                path = PATH_FS.resolve(path);
                if (!path) return { path: "", node: null };
                var defaults = { follow_mount: true, recurse_count: 0 };
                opts = Object.assign(defaults, opts);
                if (opts.recurse_count > 8) {
                    throw new FS.ErrnoError(32);
                }
                var parts = path.split("/").filter((p) => !!p);
                var current = FS.root;
                var current_path = "/";
                for (var i = 0; i < parts.length; i++) {
                    var islast = i === parts.length - 1;
                    if (islast && opts.parent) {
                        break;
                    }
                    current = FS.lookupNode(current, parts[i]);
                    current_path = PATH.join2(current_path, parts[i]);
                    if (FS.isMountpoint(current)) {
                        if (!islast || (islast && opts.follow_mount)) {
                            current = current.mounted.root;
                        }
                    }
                    if (!islast || opts.follow) {
                        var count = 0;
                        while (FS.isLink(current.mode)) {
                            var link = FS.readlink(current_path);
                            current_path = PATH_FS.resolve(PATH.dirname(current_path), link);
                            var lookup = FS.lookupPath(current_path, {
                                recurse_count: opts.recurse_count + 1,
                            });
                            current = lookup.node;
                            if (count++ > 40) {
                                throw new FS.ErrnoError(32);
                            }
                        }
                    }
                }
                return { path: current_path, node: current };
            },
            getPath(node) {
                var path;
                while (true) {
                    if (FS.isRoot(node)) {
                        var mount = node.mount.mountpoint;
                        if (!path) return mount;
                        return mount[mount.length - 1] !== "/" ? `${mount}/${path}` : mount + path;
                    }
                    path = path ? `${node.name}/${path}` : node.name;
                    node = node.parent;
                }
            },
            hashName(parentid, name) {
                var hash = 0;
                for (var i = 0; i < name.length; i++) {
                    hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
                }
                return ((parentid + hash) >>> 0) % FS.nameTable.length;
            },
            hashAddNode(node) {
                var hash = FS.hashName(node.parent.id, node.name);
                node.name_next = FS.nameTable[hash];
                FS.nameTable[hash] = node;
            },
            hashRemoveNode(node) {
                var hash = FS.hashName(node.parent.id, node.name);
                if (FS.nameTable[hash] === node) {
                    FS.nameTable[hash] = node.name_next;
                } else {
                    var current = FS.nameTable[hash];
                    while (current) {
                        if (current.name_next === node) {
                            current.name_next = node.name_next;
                            break;
                        }
                        current = current.name_next;
                    }
                }
            },
            lookupNode(parent, name) {
                var errCode = FS.mayLookup(parent);
                if (errCode) {
                    throw new FS.ErrnoError(errCode);
                }
                var hash = FS.hashName(parent.id, name);
                for (var node = FS.nameTable[hash]; node; node = node.name_next) {
                    var nodeName = node.name;
                    if (node.parent.id === parent.id && nodeName === name) {
                        return node;
                    }
                }
                return FS.lookup(parent, name);
            },
            createNode(parent, name, mode, rdev) {
                var node = new FS.FSNode(parent, name, mode, rdev);
                FS.hashAddNode(node);
                return node;
            },
            destroyNode(node) {
                FS.hashRemoveNode(node);
            },
            isRoot(node) {
                return node === node.parent;
            },
            isMountpoint(node) {
                return !!node.mounted;
            },
            isFile(mode) {
                return (mode & 61440) === 32768;
            },
            isDir(mode) {
                return (mode & 61440) === 16384;
            },
            isLink(mode) {
                return (mode & 61440) === 40960;
            },
            isChrdev(mode) {
                return (mode & 61440) === 8192;
            },
            isBlkdev(mode) {
                return (mode & 61440) === 24576;
            },
            isFIFO(mode) {
                return (mode & 61440) === 4096;
            },
            isSocket(mode) {
                return (mode & 49152) === 49152;
            },
            flagsToPermissionString(flag) {
                var perms = ["r", "w", "rw"][flag & 3];
                if (flag & 512) {
                    perms += "w";
                }
                return perms;
            },
            nodePermissions(node, perms) {
                if (FS.ignorePermissions) {
                    return 0;
                }
                if (perms.includes("r") && !(node.mode & 292)) {
                    return 2;
                } else if (perms.includes("w") && !(node.mode & 146)) {
                    return 2;
                } else if (perms.includes("x") && !(node.mode & 73)) {
                    return 2;
                }
                return 0;
            },
            mayLookup(dir) {
                if (!FS.isDir(dir.mode)) return 54;
                var errCode = FS.nodePermissions(dir, "x");
                if (errCode) return errCode;
                if (!dir.node_ops.lookup) return 2;
                return 0;
            },
            mayCreate(dir, name) {
                try {
                    var node = FS.lookupNode(dir, name);
                    return 20;
                } catch (e) {}
                return FS.nodePermissions(dir, "wx");
            },
            mayDelete(dir, name, isdir) {
                var node;
                try {
                    node = FS.lookupNode(dir, name);
                } catch (e) {
                    return e.errno;
                }
                var errCode = FS.nodePermissions(dir, "wx");
                if (errCode) {
                    return errCode;
                }
                if (isdir) {
                    if (!FS.isDir(node.mode)) {
                        return 54;
                    }
                    if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
                        return 10;
                    }
                } else {
                    if (FS.isDir(node.mode)) {
                        return 31;
                    }
                }
                return 0;
            },
            mayOpen(node, flags) {
                if (!node) {
                    return 44;
                }
                if (FS.isLink(node.mode)) {
                    return 32;
                } else if (FS.isDir(node.mode)) {
                    if (FS.flagsToPermissionString(flags) !== "r" || flags & 512) {
                        return 31;
                    }
                }
                return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
            },
            MAX_OPEN_FDS: 4096,
            nextfd() {
                for (var fd = 0; fd <= FS.MAX_OPEN_FDS; fd++) {
                    if (!FS.streams[fd]) {
                        return fd;
                    }
                }
                throw new FS.ErrnoError(33);
            },
            getStreamChecked(fd) {
                var stream = FS.getStream(fd);
                if (!stream) {
                    throw new FS.ErrnoError(8);
                }
                return stream;
            },
            getStream: (fd) => FS.streams[fd],
            createStream(stream, fd = -1) {
                stream = Object.assign(new FS.FSStream(), stream);
                if (fd == -1) {
                    fd = FS.nextfd();
                }
                stream.fd = fd;
                FS.streams[fd] = stream;
                return stream;
            },
            closeStream(fd) {
                FS.streams[fd] = null;
            },
            dupStream(origStream, fd = -1) {
                var stream = FS.createStream(origStream, fd);
                stream.stream_ops?.dup?.(stream);
                return stream;
            },
            chrdev_stream_ops: {
                open(stream) {
                    var device = FS.getDevice(stream.node.rdev);
                    stream.stream_ops = device.stream_ops;
                    stream.stream_ops.open?.(stream);
                },
                llseek() {
                    throw new FS.ErrnoError(70);
                },
            },
            major: (dev) => dev >> 8,
            minor: (dev) => dev & 255,
            makedev: (ma, mi) => (ma << 8) | mi,
            registerDevice(dev, ops) {
                FS.devices[dev] = { stream_ops: ops };
            },
            getDevice: (dev) => FS.devices[dev],
            getMounts(mount) {
                var mounts = [];
                var check = [mount];
                while (check.length) {
                    var m = check.pop();
                    mounts.push(m);
                    check.push(...m.mounts);
                }
                return mounts;
            },
            syncfs(populate, callback) {
                if (typeof populate == "function") {
                    callback = populate;
                    populate = false;
                }
                FS.syncFSRequests++;
                if (FS.syncFSRequests > 1) {
                    err(
                        `warning: ${FS.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`,
                    );
                }
                var mounts = FS.getMounts(FS.root.mount);
                var completed = 0;
                function doCallback(errCode) {
                    FS.syncFSRequests--;
                    return callback(errCode);
                }
                function done(errCode) {
                    if (errCode) {
                        if (!done.errored) {
                            done.errored = true;
                            return doCallback(errCode);
                        }
                        return;
                    }
                    if (++completed >= mounts.length) {
                        doCallback(null);
                    }
                }
                mounts.forEach((mount) => {
                    if (!mount.type.syncfs) {
                        return done(null);
                    }
                    mount.type.syncfs(mount, populate, done);
                });
            },
            mount(type, opts, mountpoint) {
                var root = mountpoint === "/";
                var pseudo = !mountpoint;
                var node;
                if (root && FS.root) {
                    throw new FS.ErrnoError(10);
                } else if (!root && !pseudo) {
                    var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
                    mountpoint = lookup.path;
                    node = lookup.node;
                    if (FS.isMountpoint(node)) {
                        throw new FS.ErrnoError(10);
                    }
                    if (!FS.isDir(node.mode)) {
                        throw new FS.ErrnoError(54);
                    }
                }
                var mount = { type, opts, mountpoint, mounts: [] };
                var mountRoot = type.mount(mount);
                mountRoot.mount = mount;
                mount.root = mountRoot;
                if (root) {
                    FS.root = mountRoot;
                } else if (node) {
                    node.mounted = mount;
                    if (node.mount) {
                        node.mount.mounts.push(mount);
                    }
                }
                return mountRoot;
            },
            unmount(mountpoint) {
                var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
                if (!FS.isMountpoint(lookup.node)) {
                    throw new FS.ErrnoError(28);
                }
                var node = lookup.node;
                var mount = node.mounted;
                var mounts = FS.getMounts(mount);
                Object.keys(FS.nameTable).forEach((hash) => {
                    var current = FS.nameTable[hash];
                    while (current) {
                        var next = current.name_next;
                        if (mounts.includes(current.mount)) {
                            FS.destroyNode(current);
                        }
                        current = next;
                    }
                });
                node.mounted = null;
                var idx = node.mount.mounts.indexOf(mount);
                node.mount.mounts.splice(idx, 1);
            },
            lookup(parent, name) {
                return parent.node_ops.lookup(parent, name);
            },
            mknod(path, mode, dev) {
                var lookup = FS.lookupPath(path, { parent: true });
                var parent = lookup.node;
                var name = PATH.basename(path);
                if (!name || name === "." || name === "..") {
                    throw new FS.ErrnoError(28);
                }
                var errCode = FS.mayCreate(parent, name);
                if (errCode) {
                    throw new FS.ErrnoError(errCode);
                }
                if (!parent.node_ops.mknod) {
                    throw new FS.ErrnoError(63);
                }
                return parent.node_ops.mknod(parent, name, mode, dev);
            },
            create(path, mode) {
                mode = mode !== undefined ? mode : 438;
                mode &= 4095;
                mode |= 32768;
                return FS.mknod(path, mode, 0);
            },
            mkdir(path, mode) {
                mode = mode !== undefined ? mode : 511;
                mode &= 511 | 512;
                mode |= 16384;
                return FS.mknod(path, mode, 0);
            },
            mkdirTree(path, mode) {
                var dirs = path.split("/");
                var d = "";
                for (var i = 0; i < dirs.length; ++i) {
                    if (!dirs[i]) continue;
                    d += "/" + dirs[i];
                    try {
                        FS.mkdir(d, mode);
                    } catch (e) {
                        if (e.errno != 20) throw e;
                    }
                }
            },
            mkdev(path, mode, dev) {
                if (typeof dev == "undefined") {
                    dev = mode;
                    mode = 438;
                }
                mode |= 8192;
                return FS.mknod(path, mode, dev);
            },
            symlink(oldpath, newpath) {
                if (!PATH_FS.resolve(oldpath)) {
                    throw new FS.ErrnoError(44);
                }
                var lookup = FS.lookupPath(newpath, { parent: true });
                var parent = lookup.node;
                if (!parent) {
                    throw new FS.ErrnoError(44);
                }
                var newname = PATH.basename(newpath);
                var errCode = FS.mayCreate(parent, newname);
                if (errCode) {
                    throw new FS.ErrnoError(errCode);
                }
                if (!parent.node_ops.symlink) {
                    throw new FS.ErrnoError(63);
                }
                return parent.node_ops.symlink(parent, newname, oldpath);
            },
            rename(old_path, new_path) {
                var old_dirname = PATH.dirname(old_path);
                var new_dirname = PATH.dirname(new_path);
                var old_name = PATH.basename(old_path);
                var new_name = PATH.basename(new_path);
                var lookup, old_dir, new_dir;
                lookup = FS.lookupPath(old_path, { parent: true });
                old_dir = lookup.node;
                lookup = FS.lookupPath(new_path, { parent: true });
                new_dir = lookup.node;
                if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
                if (old_dir.mount !== new_dir.mount) {
                    throw new FS.ErrnoError(75);
                }
                var old_node = FS.lookupNode(old_dir, old_name);
                var relative = PATH_FS.relative(old_path, new_dirname);
                if (relative.charAt(0) !== ".") {
                    throw new FS.ErrnoError(28);
                }
                relative = PATH_FS.relative(new_path, old_dirname);
                if (relative.charAt(0) !== ".") {
                    throw new FS.ErrnoError(55);
                }
                var new_node;
                try {
                    new_node = FS.lookupNode(new_dir, new_name);
                } catch (e) {}
                if (old_node === new_node) {
                    return;
                }
                var isdir = FS.isDir(old_node.mode);
                var errCode = FS.mayDelete(old_dir, old_name, isdir);
                if (errCode) {
                    throw new FS.ErrnoError(errCode);
                }
                errCode = new_node
                    ? FS.mayDelete(new_dir, new_name, isdir)
                    : FS.mayCreate(new_dir, new_name);
                if (errCode) {
                    throw new FS.ErrnoError(errCode);
                }
                if (!old_dir.node_ops.rename) {
                    throw new FS.ErrnoError(63);
                }
                if (FS.isMountpoint(old_node) || (new_node && FS.isMountpoint(new_node))) {
                    throw new FS.ErrnoError(10);
                }
                if (new_dir !== old_dir) {
                    errCode = FS.nodePermissions(old_dir, "w");
                    if (errCode) {
                        throw new FS.ErrnoError(errCode);
                    }
                }
                FS.hashRemoveNode(old_node);
                try {
                    old_dir.node_ops.rename(old_node, new_dir, new_name);
                    old_node.parent = new_dir;
                } catch (e) {
                    throw e;
                } finally {
                    FS.hashAddNode(old_node);
                }
            },
            rmdir(path) {
                var lookup = FS.lookupPath(path, { parent: true });
                var parent = lookup.node;
                var name = PATH.basename(path);
                var node = FS.lookupNode(parent, name);
                var errCode = FS.mayDelete(parent, name, true);
                if (errCode) {
                    throw new FS.ErrnoError(errCode);
                }
                if (!parent.node_ops.rmdir) {
                    throw new FS.ErrnoError(63);
                }
                if (FS.isMountpoint(node)) {
                    throw new FS.ErrnoError(10);
                }
                parent.node_ops.rmdir(parent, name);
                FS.destroyNode(node);
            },
            readdir(path) {
                var lookup = FS.lookupPath(path, { follow: true });
                var node = lookup.node;
                if (!node.node_ops.readdir) {
                    throw new FS.ErrnoError(54);
                }
                return node.node_ops.readdir(node);
            },
            unlink(path) {
                var lookup = FS.lookupPath(path, { parent: true });
                var parent = lookup.node;
                if (!parent) {
                    throw new FS.ErrnoError(44);
                }
                var name = PATH.basename(path);
                var node = FS.lookupNode(parent, name);
                var errCode = FS.mayDelete(parent, name, false);
                if (errCode) {
                    throw new FS.ErrnoError(errCode);
                }
                if (!parent.node_ops.unlink) {
                    throw new FS.ErrnoError(63);
                }
                if (FS.isMountpoint(node)) {
                    throw new FS.ErrnoError(10);
                }
                parent.node_ops.unlink(parent, name);
                FS.destroyNode(node);
            },
            readlink(path) {
                var lookup = FS.lookupPath(path);
                var link = lookup.node;
                if (!link) {
                    throw new FS.ErrnoError(44);
                }
                if (!link.node_ops.readlink) {
                    throw new FS.ErrnoError(28);
                }
                return PATH_FS.resolve(FS.getPath(link.parent), link.node_ops.readlink(link));
            },
            stat(path, dontFollow) {
                var lookup = FS.lookupPath(path, { follow: !dontFollow });
                var node = lookup.node;
                if (!node) {
                    throw new FS.ErrnoError(44);
                }
                if (!node.node_ops.getattr) {
                    throw new FS.ErrnoError(63);
                }
                return node.node_ops.getattr(node);
            },
            lstat(path) {
                return FS.stat(path, true);
            },
            chmod(path, mode, dontFollow) {
                var node;
                if (typeof path == "string") {
                    var lookup = FS.lookupPath(path, { follow: !dontFollow });
                    node = lookup.node;
                } else {
                    node = path;
                }
                if (!node.node_ops.setattr) {
                    throw new FS.ErrnoError(63);
                }
                node.node_ops.setattr(node, {
                    mode: (mode & 4095) | (node.mode & ~4095),
                    timestamp: Date.now(),
                });
            },
            lchmod(path, mode) {
                FS.chmod(path, mode, true);
            },
            fchmod(fd, mode) {
                var stream = FS.getStreamChecked(fd);
                FS.chmod(stream.node, mode);
            },
            chown(path, uid, gid, dontFollow) {
                var node;
                if (typeof path == "string") {
                    var lookup = FS.lookupPath(path, { follow: !dontFollow });
                    node = lookup.node;
                } else {
                    node = path;
                }
                if (!node.node_ops.setattr) {
                    throw new FS.ErrnoError(63);
                }
                node.node_ops.setattr(node, { timestamp: Date.now() });
            },
            lchown(path, uid, gid) {
                FS.chown(path, uid, gid, true);
            },
            fchown(fd, uid, gid) {
                var stream = FS.getStreamChecked(fd);
                FS.chown(stream.node, uid, gid);
            },
            truncate(path, len) {
                if (len < 0) {
                    throw new FS.ErrnoError(28);
                }
                var node;
                if (typeof path == "string") {
                    var lookup = FS.lookupPath(path, { follow: true });
                    node = lookup.node;
                } else {
                    node = path;
                }
                if (!node.node_ops.setattr) {
                    throw new FS.ErrnoError(63);
                }
                if (FS.isDir(node.mode)) {
                    throw new FS.ErrnoError(31);
                }
                if (!FS.isFile(node.mode)) {
                    throw new FS.ErrnoError(28);
                }
                var errCode = FS.nodePermissions(node, "w");
                if (errCode) {
                    throw new FS.ErrnoError(errCode);
                }
                node.node_ops.setattr(node, { size: len, timestamp: Date.now() });
            },
            ftruncate(fd, len) {
                var stream = FS.getStreamChecked(fd);
                if ((stream.flags & 2097155) === 0) {
                    throw new FS.ErrnoError(28);
                }
                FS.truncate(stream.node, len);
            },
            utime(path, atime, mtime) {
                var lookup = FS.lookupPath(path, { follow: true });
                var node = lookup.node;
                node.node_ops.setattr(node, { timestamp: Math.max(atime, mtime) });
            },
            open(path, flags, mode) {
                if (path === "") {
                    throw new FS.ErrnoError(44);
                }
                flags = typeof flags == "string" ? FS_modeStringToFlags(flags) : flags;
                if (flags & 64) {
                    mode = typeof mode == "undefined" ? 438 : mode;
                    mode = (mode & 4095) | 32768;
                } else {
                    mode = 0;
                }
                var node;
                if (typeof path == "object") {
                    node = path;
                } else {
                    path = PATH.normalize(path);
                    try {
                        var lookup = FS.lookupPath(path, { follow: !(flags & 131072) });
                        node = lookup.node;
                    } catch (e) {}
                }
                var created = false;
                if (flags & 64) {
                    if (node) {
                        if (flags & 128) {
                            throw new FS.ErrnoError(20);
                        }
                    } else {
                        node = FS.mknod(path, mode, 0);
                        created = true;
                    }
                }
                if (!node) {
                    throw new FS.ErrnoError(44);
                }
                if (FS.isChrdev(node.mode)) {
                    flags &= ~512;
                }
                if (flags & 65536 && !FS.isDir(node.mode)) {
                    throw new FS.ErrnoError(54);
                }
                if (!created) {
                    var errCode = FS.mayOpen(node, flags);
                    if (errCode) {
                        throw new FS.ErrnoError(errCode);
                    }
                }
                if (flags & 512 && !created) {
                    FS.truncate(node, 0);
                }
                flags &= ~(128 | 512 | 131072);
                var stream = FS.createStream({
                    node,
                    path: FS.getPath(node),
                    flags,
                    seekable: true,
                    position: 0,
                    stream_ops: node.stream_ops,
                    ungotten: [],
                    error: false,
                });
                if (stream.stream_ops.open) {
                    stream.stream_ops.open(stream);
                }
                if (Module["logReadFiles"] && !(flags & 1)) {
                    if (!(path in FS.readFiles)) {
                        FS.readFiles[path] = 1;
                    }
                }
                return stream;
            },
            close(stream) {
                if (FS.isClosed(stream)) {
                    throw new FS.ErrnoError(8);
                }
                if (stream.getdents) stream.getdents = null;
                try {
                    if (stream.stream_ops.close) {
                        stream.stream_ops.close(stream);
                    }
                } catch (e) {
                    throw e;
                } finally {
                    FS.closeStream(stream.fd);
                }
                stream.fd = null;
            },
            isClosed(stream) {
                return stream.fd === null;
            },
            llseek(stream, offset, whence) {
                if (FS.isClosed(stream)) {
                    throw new FS.ErrnoError(8);
                }
                if (!stream.seekable || !stream.stream_ops.llseek) {
                    throw new FS.ErrnoError(70);
                }
                if (whence != 0 && whence != 1 && whence != 2) {
                    throw new FS.ErrnoError(28);
                }
                stream.position = stream.stream_ops.llseek(stream, offset, whence);
                stream.ungotten = [];
                return stream.position;
            },
            read(stream, buffer, offset, length, position) {
                if (length < 0 || position < 0) {
                    throw new FS.ErrnoError(28);
                }
                if (FS.isClosed(stream)) {
                    throw new FS.ErrnoError(8);
                }
                if ((stream.flags & 2097155) === 1) {
                    throw new FS.ErrnoError(8);
                }
                if (FS.isDir(stream.node.mode)) {
                    throw new FS.ErrnoError(31);
                }
                if (!stream.stream_ops.read) {
                    throw new FS.ErrnoError(28);
                }
                var seeking = typeof position != "undefined";
                if (!seeking) {
                    position = stream.position;
                } else if (!stream.seekable) {
                    throw new FS.ErrnoError(70);
                }
                var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
                if (!seeking) stream.position += bytesRead;
                return bytesRead;
            },
            write(stream, buffer, offset, length, position, canOwn) {
                if (length < 0 || position < 0) {
                    throw new FS.ErrnoError(28);
                }
                if (FS.isClosed(stream)) {
                    throw new FS.ErrnoError(8);
                }
                if ((stream.flags & 2097155) === 0) {
                    throw new FS.ErrnoError(8);
                }
                if (FS.isDir(stream.node.mode)) {
                    throw new FS.ErrnoError(31);
                }
                if (!stream.stream_ops.write) {
                    throw new FS.ErrnoError(28);
                }
                if (stream.seekable && stream.flags & 1024) {
                    FS.llseek(stream, 0, 2);
                }
                var seeking = typeof position != "undefined";
                if (!seeking) {
                    position = stream.position;
                } else if (!stream.seekable) {
                    throw new FS.ErrnoError(70);
                }
                var bytesWritten = stream.stream_ops.write(
                    stream,
                    buffer,
                    offset,
                    length,
                    position,
                    canOwn,
                );
                if (!seeking) stream.position += bytesWritten;
                return bytesWritten;
            },
            allocate(stream, offset, length) {
                if (FS.isClosed(stream)) {
                    throw new FS.ErrnoError(8);
                }
                if (offset < 0 || length <= 0) {
                    throw new FS.ErrnoError(28);
                }
                if ((stream.flags & 2097155) === 0) {
                    throw new FS.ErrnoError(8);
                }
                if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
                    throw new FS.ErrnoError(43);
                }
                if (!stream.stream_ops.allocate) {
                    throw new FS.ErrnoError(138);
                }
                stream.stream_ops.allocate(stream, offset, length);
            },
            mmap(stream, length, position, prot, flags) {
                if ((prot & 2) !== 0 && (flags & 2) === 0 && (stream.flags & 2097155) !== 2) {
                    throw new FS.ErrnoError(2);
                }
                if ((stream.flags & 2097155) === 1) {
                    throw new FS.ErrnoError(2);
                }
                if (!stream.stream_ops.mmap) {
                    throw new FS.ErrnoError(43);
                }
                if (!length) {
                    throw new FS.ErrnoError(28);
                }
                return stream.stream_ops.mmap(stream, length, position, prot, flags);
            },
            msync(stream, buffer, offset, length, mmapFlags) {
                if (!stream.stream_ops.msync) {
                    return 0;
                }
                return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
            },
            ioctl(stream, cmd, arg) {
                if (!stream.stream_ops.ioctl) {
                    throw new FS.ErrnoError(59);
                }
                return stream.stream_ops.ioctl(stream, cmd, arg);
            },
            readFile(path, opts = {}) {
                opts.flags = opts.flags || 0;
                opts.encoding = opts.encoding || "binary";
                if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
                    throw new Error(`Invalid encoding type "${opts.encoding}"`);
                }
                var ret;
                var stream = FS.open(path, opts.flags);
                var stat = FS.stat(path);
                var length = stat.size;
                var buf = new Uint8Array(length);
                FS.read(stream, buf, 0, length, 0);
                if (opts.encoding === "utf8") {
                    ret = UTF8ArrayToString(buf);
                } else if (opts.encoding === "binary") {
                    ret = buf;
                }
                FS.close(stream);
                return ret;
            },
            writeFile(path, data, opts = {}) {
                opts.flags = opts.flags || 577;
                var stream = FS.open(path, opts.flags, opts.mode);
                if (typeof data == "string") {
                    var buf = new Uint8Array(lengthBytesUTF8(data) + 1);
                    var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
                    FS.write(stream, buf, 0, actualNumBytes, undefined, opts.canOwn);
                } else if (ArrayBuffer.isView(data)) {
                    FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn);
                } else {
                    throw new Error("Unsupported data type");
                }
                FS.close(stream);
            },
            cwd: () => FS.currentPath,
            chdir(path) {
                var lookup = FS.lookupPath(path, { follow: true });
                if (lookup.node === null) {
                    throw new FS.ErrnoError(44);
                }
                if (!FS.isDir(lookup.node.mode)) {
                    throw new FS.ErrnoError(54);
                }
                var errCode = FS.nodePermissions(lookup.node, "x");
                if (errCode) {
                    throw new FS.ErrnoError(errCode);
                }
                FS.currentPath = lookup.path;
            },
            createDefaultDirectories() {
                FS.mkdir("/tmp");
                FS.mkdir("/home");
                FS.mkdir("/home/web_user");
            },
            createDefaultDevices() {
                FS.mkdir("/dev");
                FS.registerDevice(FS.makedev(1, 3), {
                    read: () => 0,
                    write: (stream, buffer, offset, length, pos) => length,
                    llseek: () => 0,
                });
                FS.mkdev("/dev/null", FS.makedev(1, 3));
                TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
                TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
                FS.mkdev("/dev/tty", FS.makedev(5, 0));
                FS.mkdev("/dev/tty1", FS.makedev(6, 0));
                var randomBuffer = new Uint8Array(1024),
                    randomLeft = 0;
                var randomByte = () => {
                    if (randomLeft === 0) {
                        randomLeft = randomFill(randomBuffer).byteLength;
                    }
                    return randomBuffer[--randomLeft];
                };
                FS.createDevice("/dev", "random", randomByte);
                FS.createDevice("/dev", "urandom", randomByte);
                FS.mkdir("/dev/shm");
                FS.mkdir("/dev/shm/tmp");
            },
            createSpecialDirectories() {
                FS.mkdir("/proc");
                var proc_self = FS.mkdir("/proc/self");
                FS.mkdir("/proc/self/fd");
                FS.mount(
                    {
                        mount() {
                            var node = FS.createNode(proc_self, "fd", 16384 | 511, 73);
                            node.node_ops = {
                                lookup(parent, name) {
                                    var fd = +name;
                                    var stream = FS.getStreamChecked(fd);
                                    var ret = {
                                        parent: null,
                                        mount: { mountpoint: "fake" },
                                        node_ops: { readlink: () => stream.path },
                                    };
                                    ret.parent = ret;
                                    return ret;
                                },
                            };
                            return node;
                        },
                    },
                    {},
                    "/proc/self/fd",
                );
            },
            createStandardStreams(input, output, error) {
                if (input) {
                    FS.createDevice("/dev", "stdin", input);
                } else {
                    FS.symlink("/dev/tty", "/dev/stdin");
                }
                if (output) {
                    FS.createDevice("/dev", "stdout", null, output);
                } else {
                    FS.symlink("/dev/tty", "/dev/stdout");
                }
                if (error) {
                    FS.createDevice("/dev", "stderr", null, error);
                } else {
                    FS.symlink("/dev/tty1", "/dev/stderr");
                }
                var stdin = FS.open("/dev/stdin", 0);
                var stdout = FS.open("/dev/stdout", 1);
                var stderr = FS.open("/dev/stderr", 1);
            },
            staticInit() {
                FS.nameTable = new Array(4096);
                FS.mount(MEMFS, {}, "/");
                FS.createDefaultDirectories();
                FS.createDefaultDevices();
                FS.createSpecialDirectories();
                FS.filesystems = { MEMFS };
            },
            init(input, output, error) {
                FS.initialized = true;
                input ??= Module["stdin"];
                output ??= Module["stdout"];
                error ??= Module["stderr"];
                FS.createStandardStreams(input, output, error);
            },
            quit() {
                FS.initialized = false;
                for (var i = 0; i < FS.streams.length; i++) {
                    var stream = FS.streams[i];
                    if (!stream) {
                        continue;
                    }
                    FS.close(stream);
                }
            },
            findObject(path, dontResolveLastLink) {
                var ret = FS.analyzePath(path, dontResolveLastLink);
                if (!ret.exists) {
                    return null;
                }
                return ret.object;
            },
            analyzePath(path, dontResolveLastLink) {
                try {
                    var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
                    path = lookup.path;
                } catch (e) {}
                var ret = {
                    isRoot: false,
                    exists: false,
                    error: 0,
                    name: null,
                    path: null,
                    object: null,
                    parentExists: false,
                    parentPath: null,
                    parentObject: null,
                };
                try {
                    var lookup = FS.lookupPath(path, { parent: true });
                    ret.parentExists = true;
                    ret.parentPath = lookup.path;
                    ret.parentObject = lookup.node;
                    ret.name = PATH.basename(path);
                    lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
                    ret.exists = true;
                    ret.path = lookup.path;
                    ret.object = lookup.node;
                    ret.name = lookup.node.name;
                    ret.isRoot = lookup.path === "/";
                } catch (e) {
                    ret.error = e.errno;
                }
                return ret;
            },
            createPath(parent, path, canRead, canWrite) {
                parent = typeof parent == "string" ? parent : FS.getPath(parent);
                var parts = path.split("/").reverse();
                while (parts.length) {
                    var part = parts.pop();
                    if (!part) continue;
                    var current = PATH.join2(parent, part);
                    try {
                        FS.mkdir(current);
                    } catch (e) {}
                    parent = current;
                }
                return current;
            },
            createFile(parent, name, properties, canRead, canWrite) {
                var path = PATH.join2(
                    typeof parent == "string" ? parent : FS.getPath(parent),
                    name,
                );
                var mode = FS_getMode(canRead, canWrite);
                return FS.create(path, mode);
            },
            createDataFile(parent, name, data, canRead, canWrite, canOwn) {
                var path = name;
                if (parent) {
                    parent = typeof parent == "string" ? parent : FS.getPath(parent);
                    path = name ? PATH.join2(parent, name) : parent;
                }
                var mode = FS_getMode(canRead, canWrite);
                var node = FS.create(path, mode);
                if (data) {
                    if (typeof data == "string") {
                        var arr = new Array(data.length);
                        for (var i = 0, len = data.length; i < len; ++i)
                            arr[i] = data.charCodeAt(i);
                        data = arr;
                    }
                    FS.chmod(node, mode | 146);
                    var stream = FS.open(node, 577);
                    FS.write(stream, data, 0, data.length, 0, canOwn);
                    FS.close(stream);
                    FS.chmod(node, mode);
                }
            },
            createDevice(parent, name, input, output) {
                var path = PATH.join2(
                    typeof parent == "string" ? parent : FS.getPath(parent),
                    name,
                );
                var mode = FS_getMode(!!input, !!output);
                FS.createDevice.major ??= 64;
                var dev = FS.makedev(FS.createDevice.major++, 0);
                FS.registerDevice(dev, {
                    open(stream) {
                        stream.seekable = false;
                    },
                    close(stream) {
                        if (output?.buffer?.length) {
                            output(10);
                        }
                    },
                    read(stream, buffer, offset, length, pos) {
                        var bytesRead = 0;
                        for (var i = 0; i < length; i++) {
                            var result;
                            try {
                                result = input();
                            } catch (e) {
                                throw new FS.ErrnoError(29);
                            }
                            if (result === undefined && bytesRead === 0) {
                                throw new FS.ErrnoError(6);
                            }
                            if (result === null || result === undefined) break;
                            bytesRead++;
                            buffer[offset + i] = result;
                        }
                        if (bytesRead) {
                            stream.node.timestamp = Date.now();
                        }
                        return bytesRead;
                    },
                    write(stream, buffer, offset, length, pos) {
                        for (var i = 0; i < length; i++) {
                            try {
                                output(buffer[offset + i]);
                            } catch (e) {
                                throw new FS.ErrnoError(29);
                            }
                        }
                        if (length) {
                            stream.node.timestamp = Date.now();
                        }
                        return i;
                    },
                });
                return FS.mkdev(path, mode, dev);
            },
            forceLoadFile(obj) {
                if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
                if (typeof XMLHttpRequest != "undefined") {
                    throw new Error(
                        "Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.",
                    );
                } else {
                    try {
                        obj.contents = readBinary(obj.url);
                        obj.usedBytes = obj.contents.length;
                    } catch (e) {
                        throw new FS.ErrnoError(29);
                    }
                }
            },
            createLazyFile(parent, name, url, canRead, canWrite) {
                class LazyUint8Array {
                    lengthKnown = false;
                    chunks = [];
                    get(idx) {
                        if (idx > this.length - 1 || idx < 0) {
                            return undefined;
                        }
                        var chunkOffset = idx % this.chunkSize;
                        var chunkNum = (idx / this.chunkSize) | 0;
                        return this.getter(chunkNum)[chunkOffset];
                    }
                    setDataGetter(getter) {
                        this.getter = getter;
                    }
                    cacheLength() {
                        var xhr = new XMLHttpRequest();
                        xhr.open("HEAD", url, false);
                        xhr.send(null);
                        if (!((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304))
                            throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
                        var datalength = Number(xhr.getResponseHeader("Content-length"));
                        var header;
                        var hasByteServing =
                            (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
                        var usesGzip =
                            (header = xhr.getResponseHeader("Content-Encoding")) &&
                            header === "gzip";
                        var chunkSize = 1024 * 1024;
                        if (!hasByteServing) chunkSize = datalength;
                        var doXHR = (from, to) => {
                            if (from > to)
                                throw new Error(
                                    "invalid range (" +
                                        from +
                                        ", " +
                                        to +
                                        ") or no bytes requested!",
                                );
                            if (to > datalength - 1)
                                throw new Error(
                                    "only " + datalength + " bytes available! programmer error!",
                                );
                            var xhr = new XMLHttpRequest();
                            xhr.open("GET", url, false);
                            if (datalength !== chunkSize)
                                xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
                            xhr.responseType = "arraybuffer";
                            if (xhr.overrideMimeType) {
                                xhr.overrideMimeType("text/plain; charset=x-user-defined");
                            }
                            xhr.send(null);
                            if (!((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304))
                                throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
                            if (xhr.response !== undefined) {
                                return new Uint8Array(xhr.response || []);
                            }
                            return intArrayFromString(xhr.responseText || "", true);
                        };
                        var lazyArray = this;
                        lazyArray.setDataGetter((chunkNum) => {
                            var start = chunkNum * chunkSize;
                            var end = (chunkNum + 1) * chunkSize - 1;
                            end = Math.min(end, datalength - 1);
                            if (typeof lazyArray.chunks[chunkNum] == "undefined") {
                                lazyArray.chunks[chunkNum] = doXHR(start, end);
                            }
                            if (typeof lazyArray.chunks[chunkNum] == "undefined")
                                throw new Error("doXHR failed!");
                            return lazyArray.chunks[chunkNum];
                        });
                        if (usesGzip || !datalength) {
                            chunkSize = datalength = 1;
                            datalength = this.getter(0).length;
                            chunkSize = datalength;
                            out(
                                "LazyFiles on gzip forces download of the whole file when length is accessed",
                            );
                        }
                        this._length = datalength;
                        this._chunkSize = chunkSize;
                        this.lengthKnown = true;
                    }
                    get length() {
                        if (!this.lengthKnown) {
                            this.cacheLength();
                        }
                        return this._length;
                    }
                    get chunkSize() {
                        if (!this.lengthKnown) {
                            this.cacheLength();
                        }
                        return this._chunkSize;
                    }
                }
                if (typeof XMLHttpRequest != "undefined") {
                    if (!ENVIRONMENT_IS_WORKER)
                        throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
                    var lazyArray = new LazyUint8Array();
                    var properties = { isDevice: false, contents: lazyArray };
                } else {
                    var properties = { isDevice: false, url };
                }
                var node = FS.createFile(parent, name, properties, canRead, canWrite);
                if (properties.contents) {
                    node.contents = properties.contents;
                } else if (properties.url) {
                    node.contents = null;
                    node.url = properties.url;
                }
                Object.defineProperties(node, {
                    usedBytes: {
                        get: function () {
                            return this.contents.length;
                        },
                    },
                });
                var stream_ops = {};
                var keys = Object.keys(node.stream_ops);
                keys.forEach((key) => {
                    var fn = node.stream_ops[key];
                    stream_ops[key] = (...args) => {
                        FS.forceLoadFile(node);
                        return fn(...args);
                    };
                });
                function writeChunks(stream, buffer, offset, length, position) {
                    var contents = stream.node.contents;
                    if (position >= contents.length) return 0;
                    var size = Math.min(contents.length - position, length);
                    if (contents.slice) {
                        for (var i = 0; i < size; i++) {
                            buffer[offset + i] = contents[position + i];
                        }
                    } else {
                        for (var i = 0; i < size; i++) {
                            buffer[offset + i] = contents.get(position + i);
                        }
                    }
                    return size;
                }
                stream_ops.read = (stream, buffer, offset, length, position) => {
                    FS.forceLoadFile(node);
                    return writeChunks(stream, buffer, offset, length, position);
                };
                stream_ops.mmap = (stream, length, position, prot, flags) => {
                    FS.forceLoadFile(node);
                    var ptr = mmapAlloc(length);
                    if (!ptr) {
                        throw new FS.ErrnoError(48);
                    }
                    writeChunks(stream, HEAP8, ptr, length, position);
                    return { ptr, allocated: true };
                };
                node.stream_ops = stream_ops;
                return node;
            },
        };
        var SYSCALLS = {
            DEFAULT_POLLMASK: 5,
            calculateAt(dirfd, path, allowEmpty) {
                if (PATH.isAbs(path)) {
                    return path;
                }
                var dir;
                if (dirfd === -100) {
                    dir = FS.cwd();
                } else {
                    var dirstream = SYSCALLS.getStreamFromFD(dirfd);
                    dir = dirstream.path;
                }
                if (path.length == 0) {
                    if (!allowEmpty) {
                        throw new FS.ErrnoError(44);
                    }
                    return dir;
                }
                return PATH.join2(dir, path);
            },
            doStat(func, path, buf) {
                var stat = func(path);
                HEAP32[buf >> 2] = stat.dev;
                HEAP32[(buf + 4) >> 2] = stat.mode;
                HEAPU32[(buf + 8) >> 2] = stat.nlink;
                HEAP32[(buf + 12) >> 2] = stat.uid;
                HEAP32[(buf + 16) >> 2] = stat.gid;
                HEAP32[(buf + 20) >> 2] = stat.rdev;
                HEAP64[(buf + 24) >> 3] = BigInt(stat.size);
                HEAP32[(buf + 32) >> 2] = 4096;
                HEAP32[(buf + 36) >> 2] = stat.blocks;
                var atime = stat.atime.getTime();
                var mtime = stat.mtime.getTime();
                var ctime = stat.ctime.getTime();
                HEAP64[(buf + 40) >> 3] = BigInt(Math.floor(atime / 1e3));
                HEAPU32[(buf + 48) >> 2] = (atime % 1e3) * 1e3 * 1e3;
                HEAP64[(buf + 56) >> 3] = BigInt(Math.floor(mtime / 1e3));
                HEAPU32[(buf + 64) >> 2] = (mtime % 1e3) * 1e3 * 1e3;
                HEAP64[(buf + 72) >> 3] = BigInt(Math.floor(ctime / 1e3));
                HEAPU32[(buf + 80) >> 2] = (ctime % 1e3) * 1e3 * 1e3;
                HEAP64[(buf + 88) >> 3] = BigInt(stat.ino);
                return 0;
            },
            doMsync(addr, stream, len, flags, offset) {
                if (!FS.isFile(stream.node.mode)) {
                    throw new FS.ErrnoError(43);
                }
                if (flags & 2) {
                    return 0;
                }
                var buffer = HEAPU8.slice(addr, addr + len);
                FS.msync(stream, buffer, offset, len, flags);
            },
            getStreamFromFD(fd) {
                var stream = FS.getStreamChecked(fd);
                return stream;
            },
            varargs: undefined,
            getStr(ptr) {
                var ret = UTF8ToString(ptr);
                return ret;
            },
        };
        function ___syscall_fcntl64(fd, cmd, varargs) {
            SYSCALLS.varargs = varargs;
            try {
                var stream = SYSCALLS.getStreamFromFD(fd);
                switch (cmd) {
                    case 0: {
                        var arg = syscallGetVarargI();
                        if (arg < 0) {
                            return -28;
                        }
                        while (FS.streams[arg]) {
                            arg++;
                        }
                        var newStream;
                        newStream = FS.dupStream(stream, arg);
                        return newStream.fd;
                    }
                    case 1:
                    case 2:
                        return 0;
                    case 3:
                        return stream.flags;
                    case 4: {
                        var arg = syscallGetVarargI();
                        stream.flags |= arg;
                        return 0;
                    }
                    case 12: {
                        var arg = syscallGetVarargP();
                        var offset = 0;
                        HEAP16[(arg + offset) >> 1] = 2;
                        return 0;
                    }
                    case 13:
                    case 14:
                        return 0;
                }
                return -28;
            } catch (e) {
                if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
                return -e.errno;
            }
        }
        function ___syscall_ioctl(fd, op, varargs) {
            SYSCALLS.varargs = varargs;
            try {
                var stream = SYSCALLS.getStreamFromFD(fd);
                switch (op) {
                    case 21509: {
                        if (!stream.tty) return -59;
                        return 0;
                    }
                    case 21505: {
                        if (!stream.tty) return -59;
                        if (stream.tty.ops.ioctl_tcgets) {
                            var termios = stream.tty.ops.ioctl_tcgets(stream);
                            var argp = syscallGetVarargP();
                            HEAP32[argp >> 2] = termios.c_iflag || 0;
                            HEAP32[(argp + 4) >> 2] = termios.c_oflag || 0;
                            HEAP32[(argp + 8) >> 2] = termios.c_cflag || 0;
                            HEAP32[(argp + 12) >> 2] = termios.c_lflag || 0;
                            for (var i = 0; i < 32; i++) {
                                HEAP8[argp + i + 17] = termios.c_cc[i] || 0;
                            }
                            return 0;
                        }
                        return 0;
                    }
                    case 21510:
                    case 21511:
                    case 21512: {
                        if (!stream.tty) return -59;
                        return 0;
                    }
                    case 21506:
                    case 21507:
                    case 21508: {
                        if (!stream.tty) return -59;
                        if (stream.tty.ops.ioctl_tcsets) {
                            var argp = syscallGetVarargP();
                            var c_iflag = HEAP32[argp >> 2];
                            var c_oflag = HEAP32[(argp + 4) >> 2];
                            var c_cflag = HEAP32[(argp + 8) >> 2];
                            var c_lflag = HEAP32[(argp + 12) >> 2];
                            var c_cc = [];
                            for (var i = 0; i < 32; i++) {
                                c_cc.push(HEAP8[argp + i + 17]);
                            }
                            return stream.tty.ops.ioctl_tcsets(stream.tty, op, {
                                c_iflag,
                                c_oflag,
                                c_cflag,
                                c_lflag,
                                c_cc,
                            });
                        }
                        return 0;
                    }
                    case 21519: {
                        if (!stream.tty) return -59;
                        var argp = syscallGetVarargP();
                        HEAP32[argp >> 2] = 0;
                        return 0;
                    }
                    case 21520: {
                        if (!stream.tty) return -59;
                        return -28;
                    }
                    case 21531: {
                        var argp = syscallGetVarargP();
                        return FS.ioctl(stream, op, argp);
                    }
                    case 21523: {
                        if (!stream.tty) return -59;
                        if (stream.tty.ops.ioctl_tiocgwinsz) {
                            var winsize = stream.tty.ops.ioctl_tiocgwinsz(stream.tty);
                            var argp = syscallGetVarargP();
                            HEAP16[argp >> 1] = winsize[0];
                            HEAP16[(argp + 2) >> 1] = winsize[1];
                        }
                        return 0;
                    }
                    case 21524: {
                        if (!stream.tty) return -59;
                        return 0;
                    }
                    case 21515: {
                        if (!stream.tty) return -59;
                        return 0;
                    }
                    default:
                        return -28;
                }
            } catch (e) {
                if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
                return -e.errno;
            }
        }
        function ___syscall_openat(dirfd, path, flags, varargs) {
            SYSCALLS.varargs = varargs;
            try {
                path = SYSCALLS.getStr(path);
                path = SYSCALLS.calculateAt(dirfd, path);
                var mode = varargs ? syscallGetVarargI() : 0;
                return FS.open(path, flags, mode).fd;
            } catch (e) {
                if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
                return -e.errno;
            }
        }
        var __abort_js = () => {
            abort("");
        };
        var embindRepr = (v) => {
            if (v === null) {
                return "null";
            }
            var t = typeof v;
            if (t === "object" || t === "array" || t === "function") {
                return v.toString();
            } else {
                return "" + v;
            }
        };
        var embind_init_charCodes = () => {
            var codes = new Array(256);
            for (var i = 0; i < 256; ++i) {
                codes[i] = String.fromCharCode(i);
            }
            embind_charCodes = codes;
        };
        var embind_charCodes;
        var readLatin1String = (ptr) => {
            var ret = "";
            var c = ptr;
            while (HEAPU8[c]) {
                ret += embind_charCodes[HEAPU8[c++]];
            }
            return ret;
        };
        var awaitingDependencies = {};
        var registeredTypes = {};
        var typeDependencies = {};
        var BindingError;
        var throwBindingError = (message) => {
            throw new BindingError(message);
        };
        var InternalError;
        var throwInternalError = (message) => {
            throw new InternalError(message);
        };
        var whenDependentTypesAreResolved = (myTypes, dependentTypes, getTypeConverters) => {
            myTypes.forEach((type) => (typeDependencies[type] = dependentTypes));
            function onComplete(typeConverters) {
                var myTypeConverters = getTypeConverters(typeConverters);
                if (myTypeConverters.length !== myTypes.length) {
                    throwInternalError("Mismatched type converter count");
                }
                for (var i = 0; i < myTypes.length; ++i) {
                    registerType(myTypes[i], myTypeConverters[i]);
                }
            }
            var typeConverters = new Array(dependentTypes.length);
            var unregisteredTypes = [];
            var registered = 0;
            dependentTypes.forEach((dt, i) => {
                if (registeredTypes.hasOwnProperty(dt)) {
                    typeConverters[i] = registeredTypes[dt];
                } else {
                    unregisteredTypes.push(dt);
                    if (!awaitingDependencies.hasOwnProperty(dt)) {
                        awaitingDependencies[dt] = [];
                    }
                    awaitingDependencies[dt].push(() => {
                        typeConverters[i] = registeredTypes[dt];
                        ++registered;
                        if (registered === unregisteredTypes.length) {
                            onComplete(typeConverters);
                        }
                    });
                }
            });
            if (0 === unregisteredTypes.length) {
                onComplete(typeConverters);
            }
        };
        function sharedRegisterType(rawType, registeredInstance, options = {}) {
            var name = registeredInstance.name;
            if (!rawType) {
                throwBindingError(`type "${name}" must have a positive integer typeid pointer`);
            }
            if (registeredTypes.hasOwnProperty(rawType)) {
                if (options.ignoreDuplicateRegistrations) {
                    return;
                } else {
                    throwBindingError(`Cannot register type '${name}' twice`);
                }
            }
            registeredTypes[rawType] = registeredInstance;
            delete typeDependencies[rawType];
            if (awaitingDependencies.hasOwnProperty(rawType)) {
                var callbacks = awaitingDependencies[rawType];
                delete awaitingDependencies[rawType];
                callbacks.forEach((cb) => cb());
            }
        }
        function registerType(rawType, registeredInstance, options = {}) {
            return sharedRegisterType(rawType, registeredInstance, options);
        }
        var integerReadValueFromPointer = (name, width, signed) => {
            switch (width) {
                case 1:
                    return signed ? (pointer) => HEAP8[pointer] : (pointer) => HEAPU8[pointer];
                case 2:
                    return signed
                        ? (pointer) => HEAP16[pointer >> 1]
                        : (pointer) => HEAPU16[pointer >> 1];
                case 4:
                    return signed
                        ? (pointer) => HEAP32[pointer >> 2]
                        : (pointer) => HEAPU32[pointer >> 2];
                case 8:
                    return signed
                        ? (pointer) => HEAP64[pointer >> 3]
                        : (pointer) => HEAPU64[pointer >> 3];
                default:
                    throw new TypeError(`invalid integer width (${width}): ${name}`);
            }
        };
        var __embind_register_bigint = (primitiveType, name, size, minRange, maxRange) => {
            name = readLatin1String(name);
            var isUnsignedType = name.indexOf("u") != -1;
            if (isUnsignedType) {
                maxRange = (1n << 64n) - 1n;
            }
            registerType(primitiveType, {
                name,
                fromWireType: (value) => value,
                toWireType: function (destructors, value) {
                    if (typeof value != "bigint" && typeof value != "number") {
                        throw new TypeError(
                            `Cannot convert "${embindRepr(value)}" to ${this.name}`,
                        );
                    }
                    if (typeof value == "number") {
                        value = BigInt(value);
                    }
                    return value;
                },
                argPackAdvance: GenericWireTypeSize,
                readValueFromPointer: integerReadValueFromPointer(name, size, !isUnsignedType),
                destructorFunction: null,
            });
        };
        var GenericWireTypeSize = 8;
        var __embind_register_bool = (rawType, name, trueValue, falseValue) => {
            name = readLatin1String(name);
            registerType(rawType, {
                name,
                fromWireType: function (wt) {
                    return !!wt;
                },
                toWireType: function (destructors, o) {
                    return o ? trueValue : falseValue;
                },
                argPackAdvance: GenericWireTypeSize,
                readValueFromPointer: function (pointer) {
                    return this["fromWireType"](HEAPU8[pointer]);
                },
                destructorFunction: null,
            });
        };
        var shallowCopyInternalPointer = (o) => ({
            count: o.count,
            deleteScheduled: o.deleteScheduled,
            preservePointerOnDelete: o.preservePointerOnDelete,
            ptr: o.ptr,
            ptrType: o.ptrType,
            smartPtr: o.smartPtr,
            smartPtrType: o.smartPtrType,
        });
        var throwInstanceAlreadyDeleted = (obj) => {
            function getInstanceTypeName(handle) {
                return handle.$$.ptrType.registeredClass.name;
            }
            throwBindingError(getInstanceTypeName(obj) + " instance already deleted");
        };
        var finalizationRegistry = false;
        var detachFinalizer = (handle) => {};
        var runDestructor = ($$) => {
            if ($$.smartPtr) {
                $$.smartPtrType.rawDestructor($$.smartPtr);
            } else {
                $$.ptrType.registeredClass.rawDestructor($$.ptr);
            }
        };
        var releaseClassHandle = ($$) => {
            $$.count.value -= 1;
            var toDelete = 0 === $$.count.value;
            if (toDelete) {
                runDestructor($$);
            }
        };
        var downcastPointer = (ptr, ptrClass, desiredClass) => {
            if (ptrClass === desiredClass) {
                return ptr;
            }
            if (undefined === desiredClass.baseClass) {
                return null;
            }
            var rv = downcastPointer(ptr, ptrClass, desiredClass.baseClass);
            if (rv === null) {
                return null;
            }
            return desiredClass.downcast(rv);
        };
        var registeredPointers = {};
        var registeredInstances = {};
        var getBasestPointer = (class_, ptr) => {
            if (ptr === undefined) {
                throwBindingError("ptr should not be undefined");
            }
            while (class_.baseClass) {
                ptr = class_.upcast(ptr);
                class_ = class_.baseClass;
            }
            return ptr;
        };
        var getInheritedInstance = (class_, ptr) => {
            ptr = getBasestPointer(class_, ptr);
            return registeredInstances[ptr];
        };
        var makeClassHandle = (prototype, record) => {
            if (!record.ptrType || !record.ptr) {
                throwInternalError("makeClassHandle requires ptr and ptrType");
            }
            var hasSmartPtrType = !!record.smartPtrType;
            var hasSmartPtr = !!record.smartPtr;
            if (hasSmartPtrType !== hasSmartPtr) {
                throwInternalError("Both smartPtrType and smartPtr must be specified");
            }
            record.count = { value: 1 };
            return attachFinalizer(
                Object.create(prototype, { $$: { value: record, writable: true } }),
            );
        };
        function RegisteredPointer_fromWireType(ptr) {
            var rawPointer = this.getPointee(ptr);
            if (!rawPointer) {
                this.destructor(ptr);
                return null;
            }
            var registeredInstance = getInheritedInstance(this.registeredClass, rawPointer);
            if (undefined !== registeredInstance) {
                if (0 === registeredInstance.$$.count.value) {
                    registeredInstance.$$.ptr = rawPointer;
                    registeredInstance.$$.smartPtr = ptr;
                    return registeredInstance["clone"]();
                } else {
                    var rv = registeredInstance["clone"]();
                    this.destructor(ptr);
                    return rv;
                }
            }
            function makeDefaultHandle() {
                if (this.isSmartPointer) {
                    return makeClassHandle(this.registeredClass.instancePrototype, {
                        ptrType: this.pointeeType,
                        ptr: rawPointer,
                        smartPtrType: this,
                        smartPtr: ptr,
                    });
                } else {
                    return makeClassHandle(this.registeredClass.instancePrototype, {
                        ptrType: this,
                        ptr,
                    });
                }
            }
            var actualType = this.registeredClass.getActualType(rawPointer);
            var registeredPointerRecord = registeredPointers[actualType];
            if (!registeredPointerRecord) {
                return makeDefaultHandle.call(this);
            }
            var toType;
            if (this.isConst) {
                toType = registeredPointerRecord.constPointerType;
            } else {
                toType = registeredPointerRecord.pointerType;
            }
            var dp = downcastPointer(rawPointer, this.registeredClass, toType.registeredClass);
            if (dp === null) {
                return makeDefaultHandle.call(this);
            }
            if (this.isSmartPointer) {
                return makeClassHandle(toType.registeredClass.instancePrototype, {
                    ptrType: toType,
                    ptr: dp,
                    smartPtrType: this,
                    smartPtr: ptr,
                });
            } else {
                return makeClassHandle(toType.registeredClass.instancePrototype, {
                    ptrType: toType,
                    ptr: dp,
                });
            }
        }
        var attachFinalizer = (handle) => {
            if ("undefined" === typeof FinalizationRegistry) {
                attachFinalizer = (handle) => handle;
                return handle;
            }
            finalizationRegistry = new FinalizationRegistry((info) => {
                releaseClassHandle(info.$$);
            });
            attachFinalizer = (handle) => {
                var $$ = handle.$$;
                var hasSmartPtr = !!$$.smartPtr;
                if (hasSmartPtr) {
                    var info = { $$ };
                    finalizationRegistry.register(handle, info, handle);
                }
                return handle;
            };
            detachFinalizer = (handle) => finalizationRegistry.unregister(handle);
            return attachFinalizer(handle);
        };
        var deletionQueue = [];
        var flushPendingDeletes = () => {
            while (deletionQueue.length) {
                var obj = deletionQueue.pop();
                obj.$$.deleteScheduled = false;
                obj["delete"]();
            }
        };
        var delayFunction;
        var init_ClassHandle = () => {
            Object.assign(ClassHandle.prototype, {
                isAliasOf(other) {
                    if (!(this instanceof ClassHandle)) {
                        return false;
                    }
                    if (!(other instanceof ClassHandle)) {
                        return false;
                    }
                    var leftClass = this.$$.ptrType.registeredClass;
                    var left = this.$$.ptr;
                    other.$$ = other.$$;
                    var rightClass = other.$$.ptrType.registeredClass;
                    var right = other.$$.ptr;
                    while (leftClass.baseClass) {
                        left = leftClass.upcast(left);
                        leftClass = leftClass.baseClass;
                    }
                    while (rightClass.baseClass) {
                        right = rightClass.upcast(right);
                        rightClass = rightClass.baseClass;
                    }
                    return leftClass === rightClass && left === right;
                },
                clone() {
                    if (!this.$$.ptr) {
                        throwInstanceAlreadyDeleted(this);
                    }
                    if (this.$$.preservePointerOnDelete) {
                        this.$$.count.value += 1;
                        return this;
                    } else {
                        var clone = attachFinalizer(
                            Object.create(Object.getPrototypeOf(this), {
                                $$: { value: shallowCopyInternalPointer(this.$$) },
                            }),
                        );
                        clone.$$.count.value += 1;
                        clone.$$.deleteScheduled = false;
                        return clone;
                    }
                },
                delete() {
                    if (!this.$$.ptr) {
                        throwInstanceAlreadyDeleted(this);
                    }
                    if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) {
                        throwBindingError("Object already scheduled for deletion");
                    }
                    detachFinalizer(this);
                    releaseClassHandle(this.$$);
                    if (!this.$$.preservePointerOnDelete) {
                        this.$$.smartPtr = undefined;
                        this.$$.ptr = undefined;
                    }
                },
                isDeleted() {
                    return !this.$$.ptr;
                },
                deleteLater() {
                    if (!this.$$.ptr) {
                        throwInstanceAlreadyDeleted(this);
                    }
                    if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) {
                        throwBindingError("Object already scheduled for deletion");
                    }
                    deletionQueue.push(this);
                    if (deletionQueue.length === 1 && delayFunction) {
                        delayFunction(flushPendingDeletes);
                    }
                    this.$$.deleteScheduled = true;
                    return this;
                },
            });
        };
        function ClassHandle() {}
        var createNamedFunction = (name, body) =>
            Object.defineProperty(body, "name", { value: name });
        var ensureOverloadTable = (proto, methodName, humanName) => {
            if (undefined === proto[methodName].overloadTable) {
                var prevFunc = proto[methodName];
                proto[methodName] = function (...args) {
                    if (!proto[methodName].overloadTable.hasOwnProperty(args.length)) {
                        throwBindingError(
                            `Function '${humanName}' called with an invalid number of arguments (${args.length}) - expects one of (${proto[methodName].overloadTable})!`,
                        );
                    }
                    return proto[methodName].overloadTable[args.length].apply(this, args);
                };
                proto[methodName].overloadTable = [];
                proto[methodName].overloadTable[prevFunc.argCount] = prevFunc;
            }
        };
        var exposePublicSymbol = (name, value, numArguments) => {
            if (Module.hasOwnProperty(name)) {
                if (
                    undefined === numArguments ||
                    (undefined !== Module[name].overloadTable &&
                        undefined !== Module[name].overloadTable[numArguments])
                ) {
                    throwBindingError(`Cannot register public name '${name}' twice`);
                }
                ensureOverloadTable(Module, name, name);
                if (Module[name].overloadTable.hasOwnProperty(numArguments)) {
                    throwBindingError(
                        `Cannot register multiple overloads of a function with the same number of arguments (${numArguments})!`,
                    );
                }
                Module[name].overloadTable[numArguments] = value;
            } else {
                Module[name] = value;
                Module[name].argCount = numArguments;
            }
        };
        var char_0 = 48;
        var char_9 = 57;
        var makeLegalFunctionName = (name) => {
            name = name.replace(/[^a-zA-Z0-9_]/g, "$");
            var f = name.charCodeAt(0);
            if (f >= char_0 && f <= char_9) {
                return `_${name}`;
            }
            return name;
        };
        function RegisteredClass(
            name,
            constructor,
            instancePrototype,
            rawDestructor,
            baseClass,
            getActualType,
            upcast,
            downcast,
        ) {
            this.name = name;
            this.constructor = constructor;
            this.instancePrototype = instancePrototype;
            this.rawDestructor = rawDestructor;
            this.baseClass = baseClass;
            this.getActualType = getActualType;
            this.upcast = upcast;
            this.downcast = downcast;
            this.pureVirtualFunctions = [];
        }
        var upcastPointer = (ptr, ptrClass, desiredClass) => {
            while (ptrClass !== desiredClass) {
                if (!ptrClass.upcast) {
                    throwBindingError(
                        `Expected null or instance of ${desiredClass.name}, got an instance of ${ptrClass.name}`,
                    );
                }
                ptr = ptrClass.upcast(ptr);
                ptrClass = ptrClass.baseClass;
            }
            return ptr;
        };
        function constNoSmartPtrRawPointerToWireType(destructors, handle) {
            if (handle === null) {
                if (this.isReference) {
                    throwBindingError(`null is not a valid ${this.name}`);
                }
                return 0;
            }
            if (!handle.$$) {
                throwBindingError(`Cannot pass "${embindRepr(handle)}" as a ${this.name}`);
            }
            if (!handle.$$.ptr) {
                throwBindingError(`Cannot pass deleted object as a pointer of type ${this.name}`);
            }
            var handleClass = handle.$$.ptrType.registeredClass;
            var ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
            return ptr;
        }
        function genericPointerToWireType(destructors, handle) {
            var ptr;
            if (handle === null) {
                if (this.isReference) {
                    throwBindingError(`null is not a valid ${this.name}`);
                }
                if (this.isSmartPointer) {
                    ptr = this.rawConstructor();
                    if (destructors !== null) {
                        destructors.push(this.rawDestructor, ptr);
                    }
                    return ptr;
                } else {
                    return 0;
                }
            }
            if (!handle || !handle.$$) {
                throwBindingError(`Cannot pass "${embindRepr(handle)}" as a ${this.name}`);
            }
            if (!handle.$$.ptr) {
                throwBindingError(`Cannot pass deleted object as a pointer of type ${this.name}`);
            }
            if (!this.isConst && handle.$$.ptrType.isConst) {
                throwBindingError(
                    `Cannot convert argument of type ${handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name} to parameter type ${this.name}`,
                );
            }
            var handleClass = handle.$$.ptrType.registeredClass;
            ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
            if (this.isSmartPointer) {
                if (undefined === handle.$$.smartPtr) {
                    throwBindingError("Passing raw pointer to smart pointer is illegal");
                }
                switch (this.sharingPolicy) {
                    case 0:
                        if (handle.$$.smartPtrType === this) {
                            ptr = handle.$$.smartPtr;
                        } else {
                            throwBindingError(
                                `Cannot convert argument of type ${handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name} to parameter type ${this.name}`,
                            );
                        }
                        break;
                    case 1:
                        ptr = handle.$$.smartPtr;
                        break;
                    case 2:
                        if (handle.$$.smartPtrType === this) {
                            ptr = handle.$$.smartPtr;
                        } else {
                            var clonedHandle = handle["clone"]();
                            ptr = this.rawShare(
                                ptr,
                                Emval.toHandle(() => clonedHandle["delete"]()),
                            );
                            if (destructors !== null) {
                                destructors.push(this.rawDestructor, ptr);
                            }
                        }
                        break;
                    default:
                        throwBindingError("Unsupporting sharing policy");
                }
            }
            return ptr;
        }
        function nonConstNoSmartPtrRawPointerToWireType(destructors, handle) {
            if (handle === null) {
                if (this.isReference) {
                    throwBindingError(`null is not a valid ${this.name}`);
                }
                return 0;
            }
            if (!handle.$$) {
                throwBindingError(`Cannot pass "${embindRepr(handle)}" as a ${this.name}`);
            }
            if (!handle.$$.ptr) {
                throwBindingError(`Cannot pass deleted object as a pointer of type ${this.name}`);
            }
            if (handle.$$.ptrType.isConst) {
                throwBindingError(
                    `Cannot convert argument of type ${handle.$$.ptrType.name} to parameter type ${this.name}`,
                );
            }
            var handleClass = handle.$$.ptrType.registeredClass;
            var ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
            return ptr;
        }
        function readPointer(pointer) {
            return this["fromWireType"](HEAPU32[pointer >> 2]);
        }
        var init_RegisteredPointer = () => {
            Object.assign(RegisteredPointer.prototype, {
                getPointee(ptr) {
                    if (this.rawGetPointee) {
                        ptr = this.rawGetPointee(ptr);
                    }
                    return ptr;
                },
                destructor(ptr) {
                    this.rawDestructor?.(ptr);
                },
                argPackAdvance: GenericWireTypeSize,
                readValueFromPointer: readPointer,
                fromWireType: RegisteredPointer_fromWireType,
            });
        };
        function RegisteredPointer(
            name,
            registeredClass,
            isReference,
            isConst,
            isSmartPointer,
            pointeeType,
            sharingPolicy,
            rawGetPointee,
            rawConstructor,
            rawShare,
            rawDestructor,
        ) {
            this.name = name;
            this.registeredClass = registeredClass;
            this.isReference = isReference;
            this.isConst = isConst;
            this.isSmartPointer = isSmartPointer;
            this.pointeeType = pointeeType;
            this.sharingPolicy = sharingPolicy;
            this.rawGetPointee = rawGetPointee;
            this.rawConstructor = rawConstructor;
            this.rawShare = rawShare;
            this.rawDestructor = rawDestructor;
            if (!isSmartPointer && registeredClass.baseClass === undefined) {
                if (isConst) {
                    this["toWireType"] = constNoSmartPtrRawPointerToWireType;
                    this.destructorFunction = null;
                } else {
                    this["toWireType"] = nonConstNoSmartPtrRawPointerToWireType;
                    this.destructorFunction = null;
                }
            } else {
                this["toWireType"] = genericPointerToWireType;
            }
        }
        var replacePublicSymbol = (name, value, numArguments) => {
            if (!Module.hasOwnProperty(name)) {
                throwInternalError("Replacing nonexistent public symbol");
            }
            if (undefined !== Module[name].overloadTable && undefined !== numArguments) {
                Module[name].overloadTable[numArguments] = value;
            } else {
                Module[name] = value;
                Module[name].argCount = numArguments;
            }
        };
        var wasmTable;
        var getWasmTableEntry = (funcPtr) => wasmTable.get(funcPtr);
        var embind__requireFunction = (signature, rawFunction) => {
            signature = readLatin1String(signature);
            function makeDynCaller() {
                return getWasmTableEntry(rawFunction);
            }
            var fp = makeDynCaller();
            if (typeof fp != "function") {
                throwBindingError(
                    `unknown function pointer with signature ${signature}: ${rawFunction}`,
                );
            }
            return fp;
        };
        var extendError = (baseErrorType, errorName) => {
            var errorClass = createNamedFunction(errorName, function (message) {
                this.name = errorName;
                this.message = message;
                var stack = new Error(message).stack;
                if (stack !== undefined) {
                    this.stack = this.toString() + "\n" + stack.replace(/^Error(:[^\n]*)?\n/, "");
                }
            });
            errorClass.prototype = Object.create(baseErrorType.prototype);
            errorClass.prototype.constructor = errorClass;
            errorClass.prototype.toString = function () {
                if (this.message === undefined) {
                    return this.name;
                } else {
                    return `${this.name}: ${this.message}`;
                }
            };
            return errorClass;
        };
        var UnboundTypeError;
        var getTypeName = (type) => {
            var ptr = ___getTypeName(type);
            var rv = readLatin1String(ptr);
            _free(ptr);
            return rv;
        };
        var throwUnboundTypeError = (message, types) => {
            var unboundTypes = [];
            var seen = {};
            function visit(type) {
                if (seen[type]) {
                    return;
                }
                if (registeredTypes[type]) {
                    return;
                }
                if (typeDependencies[type]) {
                    typeDependencies[type].forEach(visit);
                    return;
                }
                unboundTypes.push(type);
                seen[type] = true;
            }
            types.forEach(visit);
            throw new UnboundTypeError(`${message}: ` + unboundTypes.map(getTypeName).join([", "]));
        };
        var __embind_register_class = (
            rawType,
            rawPointerType,
            rawConstPointerType,
            baseClassRawType,
            getActualTypeSignature,
            getActualType,
            upcastSignature,
            upcast,
            downcastSignature,
            downcast,
            name,
            destructorSignature,
            rawDestructor,
        ) => {
            name = readLatin1String(name);
            getActualType = embind__requireFunction(getActualTypeSignature, getActualType);
            upcast &&= embind__requireFunction(upcastSignature, upcast);
            downcast &&= embind__requireFunction(downcastSignature, downcast);
            rawDestructor = embind__requireFunction(destructorSignature, rawDestructor);
            var legalFunctionName = makeLegalFunctionName(name);
            exposePublicSymbol(legalFunctionName, function () {
                throwUnboundTypeError(`Cannot construct ${name} due to unbound types`, [
                    baseClassRawType,
                ]);
            });
            whenDependentTypesAreResolved(
                [rawType, rawPointerType, rawConstPointerType],
                baseClassRawType ? [baseClassRawType] : [],
                (base) => {
                    base = base[0];
                    var baseClass;
                    var basePrototype;
                    if (baseClassRawType) {
                        baseClass = base.registeredClass;
                        basePrototype = baseClass.instancePrototype;
                    } else {
                        basePrototype = ClassHandle.prototype;
                    }
                    var constructor = createNamedFunction(name, function (...args) {
                        if (Object.getPrototypeOf(this) !== instancePrototype) {
                            throw new BindingError("Use 'new' to construct " + name);
                        }
                        if (undefined === registeredClass.constructor_body) {
                            throw new BindingError(name + " has no accessible constructor");
                        }
                        var body = registeredClass.constructor_body[args.length];
                        if (undefined === body) {
                            throw new BindingError(
                                `Tried to invoke ctor of ${name} with invalid number of parameters (${args.length}) - expected (${Object.keys(registeredClass.constructor_body).toString()}) parameters instead!`,
                            );
                        }
                        return body.apply(this, args);
                    });
                    var instancePrototype = Object.create(basePrototype, {
                        constructor: { value: constructor },
                    });
                    constructor.prototype = instancePrototype;
                    var registeredClass = new RegisteredClass(
                        name,
                        constructor,
                        instancePrototype,
                        rawDestructor,
                        baseClass,
                        getActualType,
                        upcast,
                        downcast,
                    );
                    if (registeredClass.baseClass) {
                        registeredClass.baseClass.__derivedClasses ??= [];
                        registeredClass.baseClass.__derivedClasses.push(registeredClass);
                    }
                    var referenceConverter = new RegisteredPointer(
                        name,
                        registeredClass,
                        true,
                        false,
                        false,
                    );
                    var pointerConverter = new RegisteredPointer(
                        name + "*",
                        registeredClass,
                        false,
                        false,
                        false,
                    );
                    var constPointerConverter = new RegisteredPointer(
                        name + " const*",
                        registeredClass,
                        false,
                        true,
                        false,
                    );
                    registeredPointers[rawType] = {
                        pointerType: pointerConverter,
                        constPointerType: constPointerConverter,
                    };
                    replacePublicSymbol(legalFunctionName, constructor);
                    return [referenceConverter, pointerConverter, constPointerConverter];
                },
            );
        };
        var heap32VectorToArray = (count, firstElement) => {
            var array = [];
            for (var i = 0; i < count; i++) {
                array.push(HEAPU32[(firstElement + i * 4) >> 2]);
            }
            return array;
        };
        var runDestructors = (destructors) => {
            while (destructors.length) {
                var ptr = destructors.pop();
                var del = destructors.pop();
                del(ptr);
            }
        };
        function usesDestructorStack(argTypes) {
            for (var i = 1; i < argTypes.length; ++i) {
                if (argTypes[i] !== null && argTypes[i].destructorFunction === undefined) {
                    return true;
                }
            }
            return false;
        }
        function newFunc(constructor, argumentList) {
            if (!(constructor instanceof Function)) {
                throw new TypeError(
                    `new_ called with constructor type ${typeof constructor} which is not a function`,
                );
            }
            var dummy = createNamedFunction(
                constructor.name || "unknownFunctionName",
                function () {},
            );
            dummy.prototype = constructor.prototype;
            var obj = new dummy();
            var r = constructor.apply(obj, argumentList);
            return r instanceof Object ? r : obj;
        }
        function createJsInvoker(argTypes, isClassMethodFunc, returns, isAsync) {
            var needsDestructorStack = usesDestructorStack(argTypes);
            var argCount = argTypes.length - 2;
            var argsList = [];
            var argsListWired = ["fn"];
            if (isClassMethodFunc) {
                argsListWired.push("thisWired");
            }
            for (var i = 0; i < argCount; ++i) {
                argsList.push(`arg${i}`);
                argsListWired.push(`arg${i}Wired`);
            }
            argsList = argsList.join(",");
            argsListWired = argsListWired.join(",");
            var invokerFnBody = `return function (${argsList}) {\n`;
            if (needsDestructorStack) {
                invokerFnBody += "var destructors = [];\n";
            }
            var dtorStack = needsDestructorStack ? "destructors" : "null";
            var args1 = [
                "humanName",
                "throwBindingError",
                "invoker",
                "fn",
                "runDestructors",
                "retType",
                "classParam",
            ];
            if (isClassMethodFunc) {
                invokerFnBody += `var thisWired = classParam['toWireType'](${dtorStack}, this);\n`;
            }
            for (var i = 0; i < argCount; ++i) {
                invokerFnBody += `var arg${i}Wired = argType${i}['toWireType'](${dtorStack}, arg${i});\n`;
                args1.push(`argType${i}`);
            }
            invokerFnBody +=
                (returns || isAsync ? "var rv = " : "") + `invoker(${argsListWired});\n`;
            if (needsDestructorStack) {
                invokerFnBody += "runDestructors(destructors);\n";
            } else {
                for (var i = isClassMethodFunc ? 1 : 2; i < argTypes.length; ++i) {
                    var paramName = i === 1 ? "thisWired" : "arg" + (i - 2) + "Wired";
                    if (argTypes[i].destructorFunction !== null) {
                        invokerFnBody += `${paramName}_dtor(${paramName});\n`;
                        args1.push(`${paramName}_dtor`);
                    }
                }
            }
            if (returns) {
                invokerFnBody += "var ret = retType['fromWireType'](rv);\n" + "return ret;\n";
            } else {
            }
            invokerFnBody += "}\n";
            return [args1, invokerFnBody];
        }
        function craftInvokerFunction(
            humanName,
            argTypes,
            classType,
            cppInvokerFunc,
            cppTargetFunc,
            isAsync,
        ) {
            var argCount = argTypes.length;
            if (argCount < 2) {
                throwBindingError(
                    "argTypes array size mismatch! Must at least get return value and 'this' types!",
                );
            }
            var isClassMethodFunc = argTypes[1] !== null && classType !== null;
            var needsDestructorStack = usesDestructorStack(argTypes);
            var returns = argTypes[0].name !== "void";
            var closureArgs = [
                humanName,
                throwBindingError,
                cppInvokerFunc,
                cppTargetFunc,
                runDestructors,
                argTypes[0],
                argTypes[1],
            ];
            for (var i = 0; i < argCount - 2; ++i) {
                closureArgs.push(argTypes[i + 2]);
            }
            if (!needsDestructorStack) {
                for (var i = isClassMethodFunc ? 1 : 2; i < argTypes.length; ++i) {
                    if (argTypes[i].destructorFunction !== null) {
                        closureArgs.push(argTypes[i].destructorFunction);
                    }
                }
            }
            let [args, invokerFnBody] = createJsInvoker(
                argTypes,
                isClassMethodFunc,
                returns,
                isAsync,
            );
            args.push(invokerFnBody);
            var invokerFn = newFunc(Function, args)(...closureArgs);
            return createNamedFunction(humanName, invokerFn);
        }
        var __embind_register_class_constructor = (
            rawClassType,
            argCount,
            rawArgTypesAddr,
            invokerSignature,
            invoker,
            rawConstructor,
        ) => {
            var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
            invoker = embind__requireFunction(invokerSignature, invoker);
            whenDependentTypesAreResolved([], [rawClassType], (classType) => {
                classType = classType[0];
                var humanName = `constructor ${classType.name}`;
                if (undefined === classType.registeredClass.constructor_body) {
                    classType.registeredClass.constructor_body = [];
                }
                if (undefined !== classType.registeredClass.constructor_body[argCount - 1]) {
                    throw new BindingError(
                        `Cannot register multiple constructors with identical number of parameters (${argCount - 1}) for class '${classType.name}'! Overload resolution is currently only performed using the parameter count, not actual type info!`,
                    );
                }
                classType.registeredClass.constructor_body[argCount - 1] = () => {
                    throwUnboundTypeError(
                        `Cannot construct ${classType.name} due to unbound types`,
                        rawArgTypes,
                    );
                };
                whenDependentTypesAreResolved([], rawArgTypes, (argTypes) => {
                    argTypes.splice(1, 0, null);
                    classType.registeredClass.constructor_body[argCount - 1] = craftInvokerFunction(
                        humanName,
                        argTypes,
                        null,
                        invoker,
                        rawConstructor,
                    );
                    return [];
                });
                return [];
            });
        };
        var getFunctionName = (signature) => {
            signature = signature.trim();
            const argsIndex = signature.indexOf("(");
            if (argsIndex !== -1) {
                return signature.substr(0, argsIndex);
            } else {
                return signature;
            }
        };
        var __embind_register_class_function = (
            rawClassType,
            methodName,
            argCount,
            rawArgTypesAddr,
            invokerSignature,
            rawInvoker,
            context,
            isPureVirtual,
            isAsync,
            isNonnullReturn,
        ) => {
            var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
            methodName = readLatin1String(methodName);
            methodName = getFunctionName(methodName);
            rawInvoker = embind__requireFunction(invokerSignature, rawInvoker);
            whenDependentTypesAreResolved([], [rawClassType], (classType) => {
                classType = classType[0];
                var humanName = `${classType.name}.${methodName}`;
                if (methodName.startsWith("@@")) {
                    methodName = Symbol[methodName.substring(2)];
                }
                if (isPureVirtual) {
                    classType.registeredClass.pureVirtualFunctions.push(methodName);
                }
                function unboundTypesHandler() {
                    throwUnboundTypeError(
                        `Cannot call ${humanName} due to unbound types`,
                        rawArgTypes,
                    );
                }
                var proto = classType.registeredClass.instancePrototype;
                var method = proto[methodName];
                if (
                    undefined === method ||
                    (undefined === method.overloadTable &&
                        method.className !== classType.name &&
                        method.argCount === argCount - 2)
                ) {
                    unboundTypesHandler.argCount = argCount - 2;
                    unboundTypesHandler.className = classType.name;
                    proto[methodName] = unboundTypesHandler;
                } else {
                    ensureOverloadTable(proto, methodName, humanName);
                    proto[methodName].overloadTable[argCount - 2] = unboundTypesHandler;
                }
                whenDependentTypesAreResolved([], rawArgTypes, (argTypes) => {
                    var memberFunction = craftInvokerFunction(
                        humanName,
                        argTypes,
                        classType,
                        rawInvoker,
                        context,
                        isAsync,
                    );
                    if (undefined === proto[methodName].overloadTable) {
                        memberFunction.argCount = argCount - 2;
                        proto[methodName] = memberFunction;
                    } else {
                        proto[methodName].overloadTable[argCount - 2] = memberFunction;
                    }
                    return [];
                });
                return [];
            });
        };
        var emval_freelist = [];
        var emval_handles = [];
        var __emval_decref = (handle) => {
            if (handle > 9 && 0 === --emval_handles[handle + 1]) {
                emval_handles[handle] = undefined;
                emval_freelist.push(handle);
            }
        };
        var count_emval_handles = () => emval_handles.length / 2 - 5 - emval_freelist.length;
        var init_emval = () => {
            emval_handles.push(0, 1, undefined, 1, null, 1, true, 1, false, 1);
            Module["count_emval_handles"] = count_emval_handles;
        };
        var Emval = {
            toValue: (handle) => {
                if (!handle) {
                    throwBindingError("Cannot use deleted val. handle = " + handle);
                }
                return emval_handles[handle];
            },
            toHandle: (value) => {
                switch (value) {
                    case undefined:
                        return 2;
                    case null:
                        return 4;
                    case true:
                        return 6;
                    case false:
                        return 8;
                    default: {
                        const handle = emval_freelist.pop() || emval_handles.length;
                        emval_handles[handle] = value;
                        emval_handles[handle + 1] = 1;
                        return handle;
                    }
                }
            },
        };
        var EmValType = {
            name: "emscripten::val",
            fromWireType: (handle) => {
                var rv = Emval.toValue(handle);
                __emval_decref(handle);
                return rv;
            },
            toWireType: (destructors, value) => Emval.toHandle(value),
            argPackAdvance: GenericWireTypeSize,
            readValueFromPointer: readPointer,
            destructorFunction: null,
        };
        var __embind_register_emval = (rawType) => registerType(rawType, EmValType);
        var floatReadValueFromPointer = (name, width) => {
            switch (width) {
                case 4:
                    return function (pointer) {
                        return this["fromWireType"](HEAPF32[pointer >> 2]);
                    };
                case 8:
                    return function (pointer) {
                        return this["fromWireType"](HEAPF64[pointer >> 3]);
                    };
                default:
                    throw new TypeError(`invalid float width (${width}): ${name}`);
            }
        };
        var __embind_register_float = (rawType, name, size) => {
            name = readLatin1String(name);
            registerType(rawType, {
                name,
                fromWireType: (value) => value,
                toWireType: (destructors, value) => value,
                argPackAdvance: GenericWireTypeSize,
                readValueFromPointer: floatReadValueFromPointer(name, size),
                destructorFunction: null,
            });
        };
        var __embind_register_function = (
            name,
            argCount,
            rawArgTypesAddr,
            signature,
            rawInvoker,
            fn,
            isAsync,
            isNonnullReturn,
        ) => {
            var argTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
            name = readLatin1String(name);
            name = getFunctionName(name);
            rawInvoker = embind__requireFunction(signature, rawInvoker);
            exposePublicSymbol(
                name,
                function () {
                    throwUnboundTypeError(`Cannot call ${name} due to unbound types`, argTypes);
                },
                argCount - 1,
            );
            whenDependentTypesAreResolved([], argTypes, (argTypes) => {
                var invokerArgsArray = [argTypes[0], null].concat(argTypes.slice(1));
                replacePublicSymbol(
                    name,
                    craftInvokerFunction(name, invokerArgsArray, null, rawInvoker, fn, isAsync),
                    argCount - 1,
                );
                return [];
            });
        };
        var __embind_register_integer = (primitiveType, name, size, minRange, maxRange) => {
            name = readLatin1String(name);
            if (maxRange === -1) {
                maxRange = 4294967295;
            }
            var fromWireType = (value) => value;
            if (minRange === 0) {
                var bitshift = 32 - 8 * size;
                fromWireType = (value) => (value << bitshift) >>> bitshift;
            }
            var isUnsignedType = name.includes("unsigned");
            var checkAssertions = (value, toTypeName) => {};
            var toWireType;
            if (isUnsignedType) {
                toWireType = function (destructors, value) {
                    checkAssertions(value, this.name);
                    return value >>> 0;
                };
            } else {
                toWireType = function (destructors, value) {
                    checkAssertions(value, this.name);
                    return value;
                };
            }
            registerType(primitiveType, {
                name,
                fromWireType,
                toWireType,
                argPackAdvance: GenericWireTypeSize,
                readValueFromPointer: integerReadValueFromPointer(name, size, minRange !== 0),
                destructorFunction: null,
            });
        };
        var __embind_register_memory_view = (rawType, dataTypeIndex, name) => {
            var typeMapping = [
                Int8Array,
                Uint8Array,
                Int16Array,
                Uint16Array,
                Int32Array,
                Uint32Array,
                Float32Array,
                Float64Array,
                BigInt64Array,
                BigUint64Array,
            ];
            var TA = typeMapping[dataTypeIndex];
            function decodeMemoryView(handle) {
                var size = HEAPU32[handle >> 2];
                var data = HEAPU32[(handle + 4) >> 2];
                return new TA(HEAP8.buffer, data, size);
            }
            name = readLatin1String(name);
            registerType(
                rawType,
                {
                    name,
                    fromWireType: decodeMemoryView,
                    argPackAdvance: GenericWireTypeSize,
                    readValueFromPointer: decodeMemoryView,
                },
                { ignoreDuplicateRegistrations: true },
            );
        };
        var stringToUTF8 = (str, outPtr, maxBytesToWrite) =>
            stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
        var __embind_register_std_string = (rawType, name) => {
            name = readLatin1String(name);
            var stdStringIsUTF8 = name === "std::string";
            registerType(rawType, {
                name,
                fromWireType(value) {
                    var length = HEAPU32[value >> 2];
                    var payload = value + 4;
                    var str;
                    if (stdStringIsUTF8) {
                        var decodeStartPtr = payload;
                        for (var i = 0; i <= length; ++i) {
                            var currentBytePtr = payload + i;
                            if (i == length || HEAPU8[currentBytePtr] == 0) {
                                var maxRead = currentBytePtr - decodeStartPtr;
                                var stringSegment = UTF8ToString(decodeStartPtr, maxRead);
                                if (str === undefined) {
                                    str = stringSegment;
                                } else {
                                    str += String.fromCharCode(0);
                                    str += stringSegment;
                                }
                                decodeStartPtr = currentBytePtr + 1;
                            }
                        }
                    } else {
                        var a = new Array(length);
                        for (var i = 0; i < length; ++i) {
                            a[i] = String.fromCharCode(HEAPU8[payload + i]);
                        }
                        str = a.join("");
                    }
                    _free(value);
                    return str;
                },
                toWireType(destructors, value) {
                    if (value instanceof ArrayBuffer) {
                        value = new Uint8Array(value);
                    }
                    var length;
                    var valueIsOfTypeString = typeof value == "string";
                    if (
                        !(
                            valueIsOfTypeString ||
                            value instanceof Uint8Array ||
                            value instanceof Uint8ClampedArray ||
                            value instanceof Int8Array
                        )
                    ) {
                        throwBindingError("Cannot pass non-string to std::string");
                    }
                    if (stdStringIsUTF8 && valueIsOfTypeString) {
                        length = lengthBytesUTF8(value);
                    } else {
                        length = value.length;
                    }
                    var base = _malloc(4 + length + 1);
                    var ptr = base + 4;
                    HEAPU32[base >> 2] = length;
                    if (stdStringIsUTF8 && valueIsOfTypeString) {
                        stringToUTF8(value, ptr, length + 1);
                    } else {
                        if (valueIsOfTypeString) {
                            for (var i = 0; i < length; ++i) {
                                var charCode = value.charCodeAt(i);
                                if (charCode > 255) {
                                    _free(ptr);
                                    throwBindingError(
                                        "String has UTF-16 code units that do not fit in 8 bits",
                                    );
                                }
                                HEAPU8[ptr + i] = charCode;
                            }
                        } else {
                            for (var i = 0; i < length; ++i) {
                                HEAPU8[ptr + i] = value[i];
                            }
                        }
                    }
                    if (destructors !== null) {
                        destructors.push(_free, base);
                    }
                    return base;
                },
                argPackAdvance: GenericWireTypeSize,
                readValueFromPointer: readPointer,
                destructorFunction(ptr) {
                    _free(ptr);
                },
            });
        };
        var UTF16Decoder =
            typeof TextDecoder != "undefined" ? new TextDecoder("utf-16le") : undefined;
        var UTF16ToString = (ptr, maxBytesToRead) => {
            var endPtr = ptr;
            var idx = endPtr >> 1;
            var maxIdx = idx + maxBytesToRead / 2;
            while (!(idx >= maxIdx) && HEAPU16[idx]) ++idx;
            endPtr = idx << 1;
            if (endPtr - ptr > 32 && UTF16Decoder)
                return UTF16Decoder.decode(HEAPU8.subarray(ptr, endPtr));
            var str = "";
            for (var i = 0; !(i >= maxBytesToRead / 2); ++i) {
                var codeUnit = HEAP16[(ptr + i * 2) >> 1];
                if (codeUnit == 0) break;
                str += String.fromCharCode(codeUnit);
            }
            return str;
        };
        var stringToUTF16 = (str, outPtr, maxBytesToWrite) => {
            maxBytesToWrite ??= 2147483647;
            if (maxBytesToWrite < 2) return 0;
            maxBytesToWrite -= 2;
            var startPtr = outPtr;
            var numCharsToWrite =
                maxBytesToWrite < str.length * 2 ? maxBytesToWrite / 2 : str.length;
            for (var i = 0; i < numCharsToWrite; ++i) {
                var codeUnit = str.charCodeAt(i);
                HEAP16[outPtr >> 1] = codeUnit;
                outPtr += 2;
            }
            HEAP16[outPtr >> 1] = 0;
            return outPtr - startPtr;
        };
        var lengthBytesUTF16 = (str) => str.length * 2;
        var UTF32ToString = (ptr, maxBytesToRead) => {
            var i = 0;
            var str = "";
            while (!(i >= maxBytesToRead / 4)) {
                var utf32 = HEAP32[(ptr + i * 4) >> 2];
                if (utf32 == 0) break;
                ++i;
                if (utf32 >= 65536) {
                    var ch = utf32 - 65536;
                    str += String.fromCharCode(55296 | (ch >> 10), 56320 | (ch & 1023));
                } else {
                    str += String.fromCharCode(utf32);
                }
            }
            return str;
        };
        var stringToUTF32 = (str, outPtr, maxBytesToWrite) => {
            maxBytesToWrite ??= 2147483647;
            if (maxBytesToWrite < 4) return 0;
            var startPtr = outPtr;
            var endPtr = startPtr + maxBytesToWrite - 4;
            for (var i = 0; i < str.length; ++i) {
                var codeUnit = str.charCodeAt(i);
                if (codeUnit >= 55296 && codeUnit <= 57343) {
                    var trailSurrogate = str.charCodeAt(++i);
                    codeUnit = (65536 + ((codeUnit & 1023) << 10)) | (trailSurrogate & 1023);
                }
                HEAP32[outPtr >> 2] = codeUnit;
                outPtr += 4;
                if (outPtr + 4 > endPtr) break;
            }
            HEAP32[outPtr >> 2] = 0;
            return outPtr - startPtr;
        };
        var lengthBytesUTF32 = (str) => {
            var len = 0;
            for (var i = 0; i < str.length; ++i) {
                var codeUnit = str.charCodeAt(i);
                if (codeUnit >= 55296 && codeUnit <= 57343) ++i;
                len += 4;
            }
            return len;
        };
        var __embind_register_std_wstring = (rawType, charSize, name) => {
            name = readLatin1String(name);
            var decodeString, encodeString, readCharAt, lengthBytesUTF;
            if (charSize === 2) {
                decodeString = UTF16ToString;
                encodeString = stringToUTF16;
                lengthBytesUTF = lengthBytesUTF16;
                readCharAt = (pointer) => HEAPU16[pointer >> 1];
            } else if (charSize === 4) {
                decodeString = UTF32ToString;
                encodeString = stringToUTF32;
                lengthBytesUTF = lengthBytesUTF32;
                readCharAt = (pointer) => HEAPU32[pointer >> 2];
            }
            registerType(rawType, {
                name,
                fromWireType: (value) => {
                    var length = HEAPU32[value >> 2];
                    var str;
                    var decodeStartPtr = value + 4;
                    for (var i = 0; i <= length; ++i) {
                        var currentBytePtr = value + 4 + i * charSize;
                        if (i == length || readCharAt(currentBytePtr) == 0) {
                            var maxReadBytes = currentBytePtr - decodeStartPtr;
                            var stringSegment = decodeString(decodeStartPtr, maxReadBytes);
                            if (str === undefined) {
                                str = stringSegment;
                            } else {
                                str += String.fromCharCode(0);
                                str += stringSegment;
                            }
                            decodeStartPtr = currentBytePtr + charSize;
                        }
                    }
                    _free(value);
                    return str;
                },
                toWireType: (destructors, value) => {
                    if (!(typeof value == "string")) {
                        throwBindingError(`Cannot pass non-string to C++ string type ${name}`);
                    }
                    var length = lengthBytesUTF(value);
                    var ptr = _malloc(4 + length + charSize);
                    HEAPU32[ptr >> 2] = length / charSize;
                    encodeString(value, ptr + 4, length + charSize);
                    if (destructors !== null) {
                        destructors.push(_free, ptr);
                    }
                    return ptr;
                },
                argPackAdvance: GenericWireTypeSize,
                readValueFromPointer: readPointer,
                destructorFunction(ptr) {
                    _free(ptr);
                },
            });
        };
        var __embind_register_void = (rawType, name) => {
            name = readLatin1String(name);
            registerType(rawType, {
                isVoid: true,
                name,
                argPackAdvance: 0,
                fromWireType: () => undefined,
                toWireType: (destructors, o) => undefined,
            });
        };
        var runtimeKeepaliveCounter = 0;
        var __emscripten_runtime_keepalive_clear = () => {
            noExitRuntime = false;
            runtimeKeepaliveCounter = 0;
        };
        var requireRegisteredType = (rawType, humanName) => {
            var impl = registeredTypes[rawType];
            if (undefined === impl) {
                throwBindingError(`${humanName} has unknown type ${getTypeName(rawType)}`);
            }
            return impl;
        };
        var emval_returnValue = (returnType, destructorsRef, handle) => {
            var destructors = [];
            var result = returnType["toWireType"](destructors, handle);
            if (destructors.length) {
                HEAPU32[destructorsRef >> 2] = Emval.toHandle(destructors);
            }
            return result;
        };
        var __emval_as = (handle, returnType, destructorsRef) => {
            handle = Emval.toValue(handle);
            returnType = requireRegisteredType(returnType, "emval::as");
            return emval_returnValue(returnType, destructorsRef, handle);
        };
        var emval_symbols = {};
        var getStringOrSymbol = (address) => {
            var symbol = emval_symbols[address];
            if (symbol === undefined) {
                return readLatin1String(address);
            }
            return symbol;
        };
        var emval_get_global = () => {
            if (typeof globalThis == "object") {
                return globalThis;
            }
            return (function () {
                return Function;
            })()("return this")();
        };
        var __emval_get_global = (name) => {
            if (name === 0) {
                return Emval.toHandle(emval_get_global());
            } else {
                name = getStringOrSymbol(name);
                return Emval.toHandle(emval_get_global()[name]);
            }
        };
        var __emval_get_property = (handle, key) => {
            handle = Emval.toValue(handle);
            key = Emval.toValue(key);
            return Emval.toHandle(handle[key]);
        };
        var __emval_instanceof = (object, constructor) => {
            object = Emval.toValue(object);
            constructor = Emval.toValue(constructor);
            return object instanceof constructor;
        };
        var __emval_new_cstring = (v) => Emval.toHandle(getStringOrSymbol(v));
        var __emval_run_destructors = (handle) => {
            var destructors = Emval.toValue(handle);
            runDestructors(destructors);
            __emval_decref(handle);
        };
        var __emval_set_property = (handle, key, value) => {
            handle = Emval.toValue(handle);
            key = Emval.toValue(key);
            value = Emval.toValue(value);
            handle[key] = value;
        };
        var __emval_take_value = (type, arg) => {
            type = requireRegisteredType(type, "_emval_take_value");
            var v = type["readValueFromPointer"](arg);
            return Emval.toHandle(v);
        };
        var timers = {};
        var handleException = (e) => {
            if (e instanceof ExitStatus || e == "unwind") {
                return EXITSTATUS;
            }
            quit_(1, e);
        };
        var keepRuntimeAlive = () => noExitRuntime || runtimeKeepaliveCounter > 0;
        var _proc_exit = (code) => {
            EXITSTATUS = code;
            if (!keepRuntimeAlive()) {
                Module["onExit"]?.(code);
                ABORT = true;
            }
            quit_(code, new ExitStatus(code));
        };
        var exitJS = (status, implicit) => {
            EXITSTATUS = status;
            _proc_exit(status);
        };
        var _exit = exitJS;
        var maybeExit = () => {
            if (!keepRuntimeAlive()) {
                try {
                    _exit(EXITSTATUS);
                } catch (e) {
                    handleException(e);
                }
            }
        };
        var callUserCallback = (func) => {
            if (ABORT) {
                return;
            }
            try {
                func();
                maybeExit();
            } catch (e) {
                handleException(e);
            }
        };
        var _emscripten_get_now = () => performance.now();
        var __setitimer_js = (which, timeout_ms) => {
            if (timers[which]) {
                clearTimeout(timers[which].id);
                delete timers[which];
            }
            if (!timeout_ms) return 0;
            var id = setTimeout(() => {
                delete timers[which];
                callUserCallback(() => __emscripten_timeout(which, _emscripten_get_now()));
            }, timeout_ms);
            timers[which] = { id, timeout_ms };
            return 0;
        };
        var abortOnCannotGrowMemory = (requestedSize) => {
            abort("OOM");
        };
        var _emscripten_resize_heap = (requestedSize) => {
            var oldSize = HEAPU8.length;
            requestedSize >>>= 0;
            abortOnCannotGrowMemory(requestedSize);
        };
        var ENV = {};
        var getExecutableName = () => thisProgram || "./this.program";
        var getEnvStrings = () => {
            if (!getEnvStrings.strings) {
                var lang =
                    (
                        (typeof navigator == "object" &&
                            navigator.languages &&
                            navigator.languages[0]) ||
                        "C"
                    ).replace("-", "_") + ".UTF-8";
                var env = {
                    USER: "web_user",
                    LOGNAME: "web_user",
                    PATH: "/",
                    PWD: "/",
                    HOME: "/home/web_user",
                    LANG: lang,
                    _: getExecutableName(),
                };
                for (var x in ENV) {
                    if (ENV[x] === undefined) delete env[x];
                    else env[x] = ENV[x];
                }
                var strings = [];
                for (var x in env) {
                    strings.push(`${x}=${env[x]}`);
                }
                getEnvStrings.strings = strings;
            }
            return getEnvStrings.strings;
        };
        var stringToAscii = (str, buffer) => {
            for (var i = 0; i < str.length; ++i) {
                HEAP8[buffer++] = str.charCodeAt(i);
            }
            HEAP8[buffer] = 0;
        };
        var _environ_get = (__environ, environ_buf) => {
            var bufSize = 0;
            getEnvStrings().forEach((string, i) => {
                var ptr = environ_buf + bufSize;
                HEAPU32[(__environ + i * 4) >> 2] = ptr;
                stringToAscii(string, ptr);
                bufSize += string.length + 1;
            });
            return 0;
        };
        var _environ_sizes_get = (penviron_count, penviron_buf_size) => {
            var strings = getEnvStrings();
            HEAPU32[penviron_count >> 2] = strings.length;
            var bufSize = 0;
            strings.forEach((string) => (bufSize += string.length + 1));
            HEAPU32[penviron_buf_size >> 2] = bufSize;
            return 0;
        };
        function _fd_close(fd) {
            try {
                var stream = SYSCALLS.getStreamFromFD(fd);
                FS.close(stream);
                return 0;
            } catch (e) {
                if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
                return e.errno;
            }
        }
        var doReadv = (stream, iov, iovcnt, offset) => {
            var ret = 0;
            for (var i = 0; i < iovcnt; i++) {
                var ptr = HEAPU32[iov >> 2];
                var len = HEAPU32[(iov + 4) >> 2];
                iov += 8;
                var curr = FS.read(stream, HEAP8, ptr, len, offset);
                if (curr < 0) return -1;
                ret += curr;
                if (curr < len) break;
                if (typeof offset != "undefined") {
                    offset += curr;
                }
            }
            return ret;
        };
        function _fd_read(fd, iov, iovcnt, pnum) {
            try {
                var stream = SYSCALLS.getStreamFromFD(fd);
                var num = doReadv(stream, iov, iovcnt);
                HEAPU32[pnum >> 2] = num;
                return 0;
            } catch (e) {
                if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
                return e.errno;
            }
        }
        var INT53_MAX = 9007199254740992;
        var INT53_MIN = -9007199254740992;
        var bigintToI53Checked = (num) => (num < INT53_MIN || num > INT53_MAX ? NaN : Number(num));
        function _fd_seek(fd, offset, whence, newOffset) {
            offset = bigintToI53Checked(offset);
            try {
                if (isNaN(offset)) return 61;
                var stream = SYSCALLS.getStreamFromFD(fd);
                FS.llseek(stream, offset, whence);
                HEAP64[newOffset >> 3] = BigInt(stream.position);
                if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null;
                return 0;
            } catch (e) {
                if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
                return e.errno;
            }
        }
        var doWritev = (stream, iov, iovcnt, offset) => {
            var ret = 0;
            for (var i = 0; i < iovcnt; i++) {
                var ptr = HEAPU32[iov >> 2];
                var len = HEAPU32[(iov + 4) >> 2];
                iov += 8;
                var curr = FS.write(stream, HEAP8, ptr, len, offset);
                if (curr < 0) return -1;
                ret += curr;
                if (curr < len) {
                    break;
                }
                if (typeof offset != "undefined") {
                    offset += curr;
                }
            }
            return ret;
        };
        function _fd_write(fd, iov, iovcnt, pnum) {
            try {
                var stream = SYSCALLS.getStreamFromFD(fd);
                var num = doWritev(stream, iov, iovcnt);
                HEAPU32[pnum >> 2] = num;
                return 0;
            } catch (e) {
                if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
                return e.errno;
            }
        }
        var GLctx;
        var webgl_enable_WEBGL_draw_instanced_base_vertex_base_instance = (ctx) =>
            !!(ctx.dibvbi = ctx.getExtension("WEBGL_draw_instanced_base_vertex_base_instance"));
        var webgl_enable_WEBGL_multi_draw_instanced_base_vertex_base_instance = (ctx) =>
            !!(ctx.mdibvbi = ctx.getExtension(
                "WEBGL_multi_draw_instanced_base_vertex_base_instance",
            ));
        var webgl_enable_EXT_polygon_offset_clamp = (ctx) =>
            !!(ctx.extPolygonOffsetClamp = ctx.getExtension("EXT_polygon_offset_clamp"));
        var webgl_enable_EXT_clip_control = (ctx) =>
            !!(ctx.extClipControl = ctx.getExtension("EXT_clip_control"));
        var webgl_enable_WEBGL_polygon_mode = (ctx) =>
            !!(ctx.webglPolygonMode = ctx.getExtension("WEBGL_polygon_mode"));
        var webgl_enable_WEBGL_multi_draw = (ctx) =>
            !!(ctx.multiDrawWebgl = ctx.getExtension("WEBGL_multi_draw"));
        var getEmscriptenSupportedExtensions = (ctx) => {
            var supportedExtensions = [
                "EXT_color_buffer_float",
                "EXT_conservative_depth",
                "EXT_disjoint_timer_query_webgl2",
                "EXT_texture_norm16",
                "NV_shader_noperspective_interpolation",
                "WEBGL_clip_cull_distance",
                "EXT_clip_control",
                "EXT_color_buffer_half_float",
                "EXT_depth_clamp",
                "EXT_float_blend",
                "EXT_polygon_offset_clamp",
                "EXT_texture_compression_bptc",
                "EXT_texture_compression_rgtc",
                "EXT_texture_filter_anisotropic",
                "KHR_parallel_shader_compile",
                "OES_texture_float_linear",
                "WEBGL_blend_func_extended",
                "WEBGL_compressed_texture_astc",
                "WEBGL_compressed_texture_etc",
                "WEBGL_compressed_texture_etc1",
                "WEBGL_compressed_texture_s3tc",
                "WEBGL_compressed_texture_s3tc_srgb",
                "WEBGL_debug_renderer_info",
                "WEBGL_debug_shaders",
                "WEBGL_lose_context",
                "WEBGL_multi_draw",
                "WEBGL_polygon_mode",
            ];
            return (ctx.getSupportedExtensions() || []).filter((ext) =>
                supportedExtensions.includes(ext),
            );
        };
        var GL = {
            counter: 1,
            buffers: [],
            programs: [],
            framebuffers: [],
            renderbuffers: [],
            textures: [],
            shaders: [],
            vaos: [],
            contexts: [],
            offscreenCanvases: {},
            queries: [],
            samplers: [],
            transformFeedbacks: [],
            syncs: [],
            stringCache: {},
            stringiCache: {},
            unpackAlignment: 4,
            unpackRowLength: 0,
            recordError: (errorCode) => {
                if (!GL.lastError) {
                    GL.lastError = errorCode;
                }
            },
            getNewId: (table) => {
                var ret = GL.counter++;
                for (var i = table.length; i < ret; i++) {
                    table[i] = null;
                }
                return ret;
            },
            genObject: (n, buffers, createFunction, objectTable) => {
                for (var i = 0; i < n; i++) {
                    var buffer = GLctx[createFunction]();
                    var id = buffer && GL.getNewId(objectTable);
                    if (buffer) {
                        buffer.name = id;
                        objectTable[id] = buffer;
                    } else {
                        GL.recordError(1282);
                    }
                    HEAP32[(buffers + i * 4) >> 2] = id;
                }
            },
            getSource: (shader, count, string, length) => {
                var source = "";
                for (var i = 0; i < count; ++i) {
                    var len = length ? HEAPU32[(length + i * 4) >> 2] : undefined;
                    source += UTF8ToString(HEAPU32[(string + i * 4) >> 2], len);
                }
                return source;
            },
            createContext: (canvas, webGLContextAttributes) => {
                if (!canvas.getContextSafariWebGL2Fixed) {
                    canvas.getContextSafariWebGL2Fixed = canvas.getContext;
                    function fixedGetContext(ver, attrs) {
                        var gl = canvas.getContextSafariWebGL2Fixed(ver, attrs);
                        return (ver == "webgl") == gl instanceof WebGLRenderingContext ? gl : null;
                    }
                    canvas.getContext = fixedGetContext;
                }
                var ctx = canvas.getContext("webgl2", webGLContextAttributes);
                if (!ctx) return 0;
                var handle = GL.registerContext(ctx, webGLContextAttributes);
                return handle;
            },
            registerContext: (ctx, webGLContextAttributes) => {
                var handle = GL.getNewId(GL.contexts);
                var context = {
                    handle,
                    attributes: webGLContextAttributes,
                    version: webGLContextAttributes.majorVersion,
                    GLctx: ctx,
                };
                if (ctx.canvas) ctx.canvas.GLctxObject = context;
                GL.contexts[handle] = context;
                if (
                    typeof webGLContextAttributes.enableExtensionsByDefault == "undefined" ||
                    webGLContextAttributes.enableExtensionsByDefault
                ) {
                    GL.initExtensions(context);
                }
                return handle;
            },
            makeContextCurrent: (contextHandle) => {
                GL.currentContext = GL.contexts[contextHandle];
                Module.ctx = GLctx = GL.currentContext?.GLctx;
                return !(contextHandle && !GLctx);
            },
            getContext: (contextHandle) => GL.contexts[contextHandle],
            deleteContext: (contextHandle) => {
                if (GL.currentContext === GL.contexts[contextHandle]) {
                    GL.currentContext = null;
                }
                if (typeof JSEvents == "object") {
                    JSEvents.removeAllHandlersOnTarget(GL.contexts[contextHandle].GLctx.canvas);
                }
                if (GL.contexts[contextHandle] && GL.contexts[contextHandle].GLctx.canvas) {
                    GL.contexts[contextHandle].GLctx.canvas.GLctxObject = undefined;
                }
                GL.contexts[contextHandle] = null;
            },
            initExtensions: (context) => {
                context ||= GL.currentContext;
                if (context.initExtensionsDone) return;
                context.initExtensionsDone = true;
                var GLctx = context.GLctx;
                webgl_enable_WEBGL_multi_draw(GLctx);
                webgl_enable_EXT_polygon_offset_clamp(GLctx);
                webgl_enable_EXT_clip_control(GLctx);
                webgl_enable_WEBGL_polygon_mode(GLctx);
                webgl_enable_WEBGL_draw_instanced_base_vertex_base_instance(GLctx);
                webgl_enable_WEBGL_multi_draw_instanced_base_vertex_base_instance(GLctx);
                if (context.version >= 2) {
                    GLctx.disjointTimerQueryExt = GLctx.getExtension(
                        "EXT_disjoint_timer_query_webgl2",
                    );
                }
                if (context.version < 2 || !GLctx.disjointTimerQueryExt) {
                    GLctx.disjointTimerQueryExt = GLctx.getExtension("EXT_disjoint_timer_query");
                }
                getEmscriptenSupportedExtensions(GLctx).forEach((ext) => {
                    if (!ext.includes("lose_context") && !ext.includes("debug")) {
                        GLctx.getExtension(ext);
                    }
                });
            },
        };
        var _glActiveTexture = (x0) => GLctx.activeTexture(x0);
        var _glAttachShader = (program, shader) => {
            GLctx.attachShader(GL.programs[program], GL.shaders[shader]);
        };
        var _glBindBuffer = (target, buffer) => {
            if (target == 35051) {
                GLctx.currentPixelPackBufferBinding = buffer;
            } else if (target == 35052) {
                GLctx.currentPixelUnpackBufferBinding = buffer;
            }
            GLctx.bindBuffer(target, GL.buffers[buffer]);
        };
        var _glBindTexture = (target, texture) => {
            GLctx.bindTexture(target, GL.textures[texture]);
        };
        var _glBindVertexArray = (vao) => {
            GLctx.bindVertexArray(GL.vaos[vao]);
        };
        var _glBindVertexArrayOES = _glBindVertexArray;
        var _glBlendEquation = (x0) => GLctx.blendEquation(x0);
        var _glBlendEquationSeparate = (x0, x1) => GLctx.blendEquationSeparate(x0, x1);
        var _glBlendFuncSeparate = (x0, x1, x2, x3) => GLctx.blendFuncSeparate(x0, x1, x2, x3);
        var _glBufferData = (target, size, data, usage) => {
            if (true) {
                if (data && size) {
                    GLctx.bufferData(target, HEAPU8, usage, data, size);
                } else {
                    GLctx.bufferData(target, size, usage);
                }
                return;
            }
        };
        var _glBufferSubData = (target, offset, size, data) => {
            if (true) {
                size && GLctx.bufferSubData(target, offset, HEAPU8, data, size);
                return;
            }
        };
        var _glClear = (x0) => GLctx.clear(x0);
        var _glClearColor = (x0, x1, x2, x3) => GLctx.clearColor(x0, x1, x2, x3);
        var _glCompileShader = (shader) => {
            GLctx.compileShader(GL.shaders[shader]);
        };
        var _glCreateProgram = () => {
            var id = GL.getNewId(GL.programs);
            var program = GLctx.createProgram();
            program.name = id;
            program.maxUniformLength =
                program.maxAttributeLength =
                program.maxUniformBlockNameLength =
                    0;
            program.uniformIdCounter = 1;
            GL.programs[id] = program;
            return id;
        };
        var _glCreateShader = (shaderType) => {
            var id = GL.getNewId(GL.shaders);
            GL.shaders[id] = GLctx.createShader(shaderType);
            return id;
        };
        var _glDeleteBuffers = (n, buffers) => {
            for (var i = 0; i < n; i++) {
                var id = HEAP32[(buffers + i * 4) >> 2];
                var buffer = GL.buffers[id];
                if (!buffer) continue;
                GLctx.deleteBuffer(buffer);
                buffer.name = 0;
                GL.buffers[id] = null;
                if (id == GLctx.currentPixelPackBufferBinding)
                    GLctx.currentPixelPackBufferBinding = 0;
                if (id == GLctx.currentPixelUnpackBufferBinding)
                    GLctx.currentPixelUnpackBufferBinding = 0;
            }
        };
        var _glDeleteProgram = (id) => {
            if (!id) return;
            var program = GL.programs[id];
            if (!program) {
                GL.recordError(1281);
                return;
            }
            GLctx.deleteProgram(program);
            program.name = 0;
            GL.programs[id] = null;
        };
        var _glDeleteShader = (id) => {
            if (!id) return;
            var shader = GL.shaders[id];
            if (!shader) {
                GL.recordError(1281);
                return;
            }
            GLctx.deleteShader(shader);
            GL.shaders[id] = null;
        };
        var _glDeleteTextures = (n, textures) => {
            for (var i = 0; i < n; i++) {
                var id = HEAP32[(textures + i * 4) >> 2];
                var texture = GL.textures[id];
                if (!texture) continue;
                GLctx.deleteTexture(texture);
                texture.name = 0;
                GL.textures[id] = null;
            }
        };
        var _glDeleteVertexArrays = (n, vaos) => {
            for (var i = 0; i < n; i++) {
                var id = HEAP32[(vaos + i * 4) >> 2];
                GLctx.deleteVertexArray(GL.vaos[id]);
                GL.vaos[id] = null;
            }
        };
        var _glDeleteVertexArraysOES = _glDeleteVertexArrays;
        var _glDetachShader = (program, shader) => {
            GLctx.detachShader(GL.programs[program], GL.shaders[shader]);
        };
        var _glDisable = (x0) => GLctx.disable(x0);
        var _glDrawElements = (mode, count, type, indices) => {
            GLctx.drawElements(mode, count, type, indices);
        };
        var _glEnable = (x0) => GLctx.enable(x0);
        var _glEnableVertexAttribArray = (index) => {
            GLctx.enableVertexAttribArray(index);
        };
        var _glGenBuffers = (n, buffers) => {
            GL.genObject(n, buffers, "createBuffer", GL.buffers);
        };
        var _glGenTextures = (n, textures) => {
            GL.genObject(n, textures, "createTexture", GL.textures);
        };
        var _glGenVertexArrays = (n, arrays) => {
            GL.genObject(n, arrays, "createVertexArray", GL.vaos);
        };
        var _glGenVertexArraysOES = _glGenVertexArrays;
        var _glGetAttribLocation = (program, name) =>
            GLctx.getAttribLocation(GL.programs[program], UTF8ToString(name));
        var writeI53ToI64 = (ptr, num) => {
            HEAPU32[ptr >> 2] = num;
            var lower = HEAPU32[ptr >> 2];
            HEAPU32[(ptr + 4) >> 2] = (num - lower) / 4294967296;
        };
        var webglGetExtensions = function $webglGetExtensions() {
            var exts = getEmscriptenSupportedExtensions(GLctx);
            exts = exts.concat(exts.map((e) => "GL_" + e));
            return exts;
        };
        var emscriptenWebGLGet = (name_, p, type) => {
            if (!p) {
                GL.recordError(1281);
                return;
            }
            var ret = undefined;
            switch (name_) {
                case 36346:
                    ret = 1;
                    break;
                case 36344:
                    if (type != 0 && type != 1) {
                        GL.recordError(1280);
                    }
                    return;
                case 34814:
                case 36345:
                    ret = 0;
                    break;
                case 34466:
                    var formats = GLctx.getParameter(34467);
                    ret = formats ? formats.length : 0;
                    break;
                case 33309:
                    if (GL.currentContext.version < 2) {
                        GL.recordError(1282);
                        return;
                    }
                    ret = webglGetExtensions().length;
                    break;
                case 33307:
                case 33308:
                    if (GL.currentContext.version < 2) {
                        GL.recordError(1280);
                        return;
                    }
                    ret = name_ == 33307 ? 3 : 0;
                    break;
            }
            if (ret === undefined) {
                var result = GLctx.getParameter(name_);
                switch (typeof result) {
                    case "number":
                        ret = result;
                        break;
                    case "boolean":
                        ret = result ? 1 : 0;
                        break;
                    case "string":
                        GL.recordError(1280);
                        return;
                    case "object":
                        if (result === null) {
                            switch (name_) {
                                case 34964:
                                case 35725:
                                case 34965:
                                case 36006:
                                case 36007:
                                case 32873:
                                case 34229:
                                case 36662:
                                case 36663:
                                case 35053:
                                case 35055:
                                case 36010:
                                case 35097:
                                case 35869:
                                case 32874:
                                case 36389:
                                case 35983:
                                case 35368:
                                case 34068: {
                                    ret = 0;
                                    break;
                                }
                                default: {
                                    GL.recordError(1280);
                                    return;
                                }
                            }
                        } else if (
                            result instanceof Float32Array ||
                            result instanceof Uint32Array ||
                            result instanceof Int32Array ||
                            result instanceof Array
                        ) {
                            for (var i = 0; i < result.length; ++i) {
                                switch (type) {
                                    case 0:
                                        HEAP32[(p + i * 4) >> 2] = result[i];
                                        break;
                                    case 2:
                                        HEAPF32[(p + i * 4) >> 2] = result[i];
                                        break;
                                    case 4:
                                        HEAP8[p + i] = result[i] ? 1 : 0;
                                        break;
                                }
                            }
                            return;
                        } else {
                            try {
                                ret = result.name | 0;
                            } catch (e) {
                                GL.recordError(1280);
                                err(
                                    `GL_INVALID_ENUM in glGet${type}v: Unknown object returned from WebGL getParameter(${name_})! (error: ${e})`,
                                );
                                return;
                            }
                        }
                        break;
                    default:
                        GL.recordError(1280);
                        err(
                            `GL_INVALID_ENUM in glGet${type}v: Native code calling glGet${type}v(${name_}) and it returns ${result} of type ${typeof result}!`,
                        );
                        return;
                }
            }
            switch (type) {
                case 1:
                    writeI53ToI64(p, ret);
                    break;
                case 0:
                    HEAP32[p >> 2] = ret;
                    break;
                case 2:
                    HEAPF32[p >> 2] = ret;
                    break;
                case 4:
                    HEAP8[p] = ret ? 1 : 0;
                    break;
            }
        };
        var _glGetIntegerv = (name_, p) => emscriptenWebGLGet(name_, p, 0);
        var _glGetProgramInfoLog = (program, maxLength, length, infoLog) => {
            var log = GLctx.getProgramInfoLog(GL.programs[program]);
            if (log === null) log = "(unknown error)";
            var numBytesWrittenExclNull =
                maxLength > 0 && infoLog ? stringToUTF8(log, infoLog, maxLength) : 0;
            if (length) HEAP32[length >> 2] = numBytesWrittenExclNull;
        };
        var _glGetProgramiv = (program, pname, p) => {
            if (!p) {
                GL.recordError(1281);
                return;
            }
            if (program >= GL.counter) {
                GL.recordError(1281);
                return;
            }
            program = GL.programs[program];
            if (pname == 35716) {
                var log = GLctx.getProgramInfoLog(program);
                if (log === null) log = "(unknown error)";
                HEAP32[p >> 2] = log.length + 1;
            } else if (pname == 35719) {
                if (!program.maxUniformLength) {
                    var numActiveUniforms = GLctx.getProgramParameter(program, 35718);
                    for (var i = 0; i < numActiveUniforms; ++i) {
                        program.maxUniformLength = Math.max(
                            program.maxUniformLength,
                            GLctx.getActiveUniform(program, i).name.length + 1,
                        );
                    }
                }
                HEAP32[p >> 2] = program.maxUniformLength;
            } else if (pname == 35722) {
                if (!program.maxAttributeLength) {
                    var numActiveAttributes = GLctx.getProgramParameter(program, 35721);
                    for (var i = 0; i < numActiveAttributes; ++i) {
                        program.maxAttributeLength = Math.max(
                            program.maxAttributeLength,
                            GLctx.getActiveAttrib(program, i).name.length + 1,
                        );
                    }
                }
                HEAP32[p >> 2] = program.maxAttributeLength;
            } else if (pname == 35381) {
                if (!program.maxUniformBlockNameLength) {
                    var numActiveUniformBlocks = GLctx.getProgramParameter(program, 35382);
                    for (var i = 0; i < numActiveUniformBlocks; ++i) {
                        program.maxUniformBlockNameLength = Math.max(
                            program.maxUniformBlockNameLength,
                            GLctx.getActiveUniformBlockName(program, i).length + 1,
                        );
                    }
                }
                HEAP32[p >> 2] = program.maxUniformBlockNameLength;
            } else {
                HEAP32[p >> 2] = GLctx.getProgramParameter(program, pname);
            }
        };
        var _glGetShaderInfoLog = (shader, maxLength, length, infoLog) => {
            var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
            if (log === null) log = "(unknown error)";
            var numBytesWrittenExclNull =
                maxLength > 0 && infoLog ? stringToUTF8(log, infoLog, maxLength) : 0;
            if (length) HEAP32[length >> 2] = numBytesWrittenExclNull;
        };
        var _glGetShaderiv = (shader, pname, p) => {
            if (!p) {
                GL.recordError(1281);
                return;
            }
            if (pname == 35716) {
                var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
                if (log === null) log = "(unknown error)";
                var logLength = log ? log.length + 1 : 0;
                HEAP32[p >> 2] = logLength;
            } else if (pname == 35720) {
                var source = GLctx.getShaderSource(GL.shaders[shader]);
                var sourceLength = source ? source.length + 1 : 0;
                HEAP32[p >> 2] = sourceLength;
            } else {
                HEAP32[p >> 2] = GLctx.getShaderParameter(GL.shaders[shader], pname);
            }
        };
        var stringToNewUTF8 = (str) => {
            var size = lengthBytesUTF8(str) + 1;
            var ret = _malloc(size);
            if (ret) stringToUTF8(str, ret, size);
            return ret;
        };
        var _glGetString = (name_) => {
            var ret = GL.stringCache[name_];
            if (!ret) {
                switch (name_) {
                    case 7939:
                        ret = stringToNewUTF8(webglGetExtensions().join(" "));
                        break;
                    case 7936:
                    case 7937:
                    case 37445:
                    case 37446:
                        var s = GLctx.getParameter(name_);
                        if (!s) {
                            GL.recordError(1280);
                        }
                        ret = s ? stringToNewUTF8(s) : 0;
                        break;
                    case 7938:
                        var webGLVersion = GLctx.getParameter(7938);
                        var glVersion = `OpenGL ES 2.0 (${webGLVersion})`;
                        if (true) glVersion = `OpenGL ES 3.0 (${webGLVersion})`;
                        ret = stringToNewUTF8(glVersion);
                        break;
                    case 35724:
                        var glslVersion = GLctx.getParameter(35724);
                        var ver_re = /^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/;
                        var ver_num = glslVersion.match(ver_re);
                        if (ver_num !== null) {
                            if (ver_num[1].length == 3) ver_num[1] = ver_num[1] + "0";
                            glslVersion = `OpenGL ES GLSL ES ${ver_num[1]} (${glslVersion})`;
                        }
                        ret = stringToNewUTF8(glslVersion);
                        break;
                    default:
                        GL.recordError(1280);
                }
                GL.stringCache[name_] = ret;
            }
            return ret;
        };
        var jstoi_q = (str) => parseInt(str);
        var webglGetLeftBracePos = (name) => name.slice(-1) == "]" && name.lastIndexOf("[");
        var webglPrepareUniformLocationsBeforeFirstUse = (program) => {
            var uniformLocsById = program.uniformLocsById,
                uniformSizeAndIdsByName = program.uniformSizeAndIdsByName,
                i,
                j;
            if (!uniformLocsById) {
                program.uniformLocsById = uniformLocsById = {};
                program.uniformArrayNamesById = {};
                var numActiveUniforms = GLctx.getProgramParameter(program, 35718);
                for (i = 0; i < numActiveUniforms; ++i) {
                    var u = GLctx.getActiveUniform(program, i);
                    var nm = u.name;
                    var sz = u.size;
                    var lb = webglGetLeftBracePos(nm);
                    var arrayName = lb > 0 ? nm.slice(0, lb) : nm;
                    var id = program.uniformIdCounter;
                    program.uniformIdCounter += sz;
                    uniformSizeAndIdsByName[arrayName] = [sz, id];
                    for (j = 0; j < sz; ++j) {
                        uniformLocsById[id] = j;
                        program.uniformArrayNamesById[id++] = arrayName;
                    }
                }
            }
        };
        var _glGetUniformLocation = (program, name) => {
            name = UTF8ToString(name);
            if ((program = GL.programs[program])) {
                webglPrepareUniformLocationsBeforeFirstUse(program);
                var uniformLocsById = program.uniformLocsById;
                var arrayIndex = 0;
                var uniformBaseName = name;
                var leftBrace = webglGetLeftBracePos(name);
                if (leftBrace > 0) {
                    arrayIndex = jstoi_q(name.slice(leftBrace + 1)) >>> 0;
                    uniformBaseName = name.slice(0, leftBrace);
                }
                var sizeAndId = program.uniformSizeAndIdsByName[uniformBaseName];
                if (sizeAndId && arrayIndex < sizeAndId[0]) {
                    arrayIndex += sizeAndId[1];
                    if (
                        (uniformLocsById[arrayIndex] =
                            uniformLocsById[arrayIndex] || GLctx.getUniformLocation(program, name))
                    ) {
                        return arrayIndex;
                    }
                }
            } else {
                GL.recordError(1281);
            }
            return -1;
        };
        var _glIsEnabled = (x0) => GLctx.isEnabled(x0);
        var _glIsProgram = (program) => {
            program = GL.programs[program];
            if (!program) return 0;
            return GLctx.isProgram(program);
        };
        var _glLinkProgram = (program) => {
            program = GL.programs[program];
            GLctx.linkProgram(program);
            program.uniformLocsById = 0;
            program.uniformSizeAndIdsByName = {};
        };
        var _glScissor = (x0, x1, x2, x3) => GLctx.scissor(x0, x1, x2, x3);
        var _glShaderSource = (shader, count, string, length) => {
            var source = GL.getSource(shader, count, string, length);
            GLctx.shaderSource(GL.shaders[shader], source);
        };
        var computeUnpackAlignedImageSize = (width, height, sizePerPixel) => {
            function roundedToNextMultipleOf(x, y) {
                return (x + y - 1) & -y;
            }
            var plainRowSize = (GL.unpackRowLength || width) * sizePerPixel;
            var alignedRowSize = roundedToNextMultipleOf(plainRowSize, GL.unpackAlignment);
            return height * alignedRowSize;
        };
        var colorChannelsInGlTextureFormat = (format) => {
            var colorChannels = {
                5: 3,
                6: 4,
                8: 2,
                29502: 3,
                29504: 4,
                26917: 2,
                26918: 2,
                29846: 3,
                29847: 4,
            };
            return colorChannels[format - 6402] || 1;
        };
        var heapObjectForWebGLType = (type) => {
            type -= 5120;
            if (type == 0) return HEAP8;
            if (type == 1) return HEAPU8;
            if (type == 2) return HEAP16;
            if (type == 4) return HEAP32;
            if (type == 6) return HEAPF32;
            if (type == 5 || type == 28922 || type == 28520 || type == 30779 || type == 30782)
                return HEAPU32;
            return HEAPU16;
        };
        var toTypedArrayIndex = (pointer, heap) =>
            pointer >>> (31 - Math.clz32(heap.BYTES_PER_ELEMENT));
        var emscriptenWebGLGetTexPixelData = (
            type,
            format,
            width,
            height,
            pixels,
            internalFormat,
        ) => {
            var heap = heapObjectForWebGLType(type);
            var sizePerPixel = colorChannelsInGlTextureFormat(format) * heap.BYTES_PER_ELEMENT;
            var bytes = computeUnpackAlignedImageSize(width, height, sizePerPixel);
            return heap.subarray(
                toTypedArrayIndex(pixels, heap),
                toTypedArrayIndex(pixels + bytes, heap),
            );
        };
        var _glTexImage2D = (
            target,
            level,
            internalFormat,
            width,
            height,
            border,
            format,
            type,
            pixels,
        ) => {
            if (true) {
                if (GLctx.currentPixelUnpackBufferBinding) {
                    GLctx.texImage2D(
                        target,
                        level,
                        internalFormat,
                        width,
                        height,
                        border,
                        format,
                        type,
                        pixels,
                    );
                    return;
                }
                if (pixels) {
                    var heap = heapObjectForWebGLType(type);
                    var index = toTypedArrayIndex(pixels, heap);
                    GLctx.texImage2D(
                        target,
                        level,
                        internalFormat,
                        width,
                        height,
                        border,
                        format,
                        type,
                        heap,
                        index,
                    );
                    return;
                }
            }
            var pixelData = pixels
                ? emscriptenWebGLGetTexPixelData(
                      type,
                      format,
                      width,
                      height,
                      pixels,
                      internalFormat,
                  )
                : null;
            GLctx.texImage2D(
                target,
                level,
                internalFormat,
                width,
                height,
                border,
                format,
                type,
                pixelData,
            );
        };
        var _glTexParameteri = (x0, x1, x2) => GLctx.texParameteri(x0, x1, x2);
        var webglGetUniformLocation = (location) => {
            var p = GLctx.currentProgram;
            if (p) {
                var webglLoc = p.uniformLocsById[location];
                if (typeof webglLoc == "number") {
                    p.uniformLocsById[location] = webglLoc = GLctx.getUniformLocation(
                        p,
                        p.uniformArrayNamesById[location] + (webglLoc > 0 ? `[${webglLoc}]` : ""),
                    );
                }
                return webglLoc;
            } else {
                GL.recordError(1282);
            }
        };
        var _glUniform1i = (location, v0) => {
            GLctx.uniform1i(webglGetUniformLocation(location), v0);
        };
        var _glUniformMatrix4fv = (location, count, transpose, value) => {
            count &&
                GLctx.uniformMatrix4fv(
                    webglGetUniformLocation(location),
                    !!transpose,
                    HEAPF32,
                    value >> 2,
                    count * 16,
                );
        };
        var _glUseProgram = (program) => {
            program = GL.programs[program];
            GLctx.useProgram(program);
            GLctx.currentProgram = program;
        };
        var _glVertexAttribPointer = (index, size, type, normalized, stride, ptr) => {
            GLctx.vertexAttribPointer(index, size, type, !!normalized, stride, ptr);
        };
        var _glViewport = (x0, x1, x2, x3) => GLctx.viewport(x0, x1, x2, x3);
        FS.createPreloadedFile = FS_createPreloadedFile;
        FS.staticInit();
        MEMFS.doesNotExistError = new FS.ErrnoError(44);
        MEMFS.doesNotExistError.stack = "<generic error, no stack>";
        embind_init_charCodes();
        BindingError = Module["BindingError"] = class BindingError extends Error {
            constructor(message) {
                super(message);
                this.name = "BindingError";
            }
        };
        InternalError = Module["InternalError"] = class InternalError extends Error {
            constructor(message) {
                super(message);
                this.name = "InternalError";
            }
        };
        init_ClassHandle();
        init_RegisteredPointer();
        UnboundTypeError = Module["UnboundTypeError"] = extendError(Error, "UnboundTypeError");
        init_emval();
        var wasmImports = {
            a: ___assert_fail,
            U: ___cxa_throw,
            z: ___syscall_fcntl64,
            ba: ___syscall_ioctl,
            ca: ___syscall_openat,
            Y: __abort_js,
            B: __embind_register_bigint,
            ha: __embind_register_bool,
            g: __embind_register_class,
            f: __embind_register_class_constructor,
            c: __embind_register_class_function,
            ga: __embind_register_emval,
            A: __embind_register_float,
            b: __embind_register_function,
            h: __embind_register_integer,
            d: __embind_register_memory_view,
            C: __embind_register_std_string,
            s: __embind_register_std_wstring,
            ia: __embind_register_void,
            W: __emscripten_runtime_keepalive_clear,
            r: __emval_as,
            sa: __emval_decref,
            fa: __emval_get_global,
            x: __emval_get_property,
            ma: __emval_instanceof,
            Ea: __emval_new_cstring,
            Fa: __emval_run_destructors,
            q: __emval_set_property,
            m: __emval_take_value,
            X: __setitimer_js,
            Z: _emscripten_resize_heap,
            da: _environ_get,
            ea: _environ_sizes_get,
            y: _fd_close,
            aa: _fd_read,
            _: _fd_seek,
            $: _fd_write,
            T: _glActiveTexture,
            K: _glAttachShader,
            o: _glBindBuffer,
            k: _glBindTexture,
            w: _glBindVertexArrayOES,
            qa: _glBlendEquation,
            ya: _glBlendEquationSeparate,
            P: _glBlendFuncSeparate,
            p: _glBufferData,
            S: _glBufferSubData,
            ja: _glClear,
            ka: _glClearColor,
            L: _glCompileShader,
            ua: _glCreateProgram,
            N: _glCreateShader,
            F: _glDeleteBuffers,
            ra: _glDeleteProgram,
            I: _glDeleteShader,
            va: _glDeleteTextures,
            Aa: _glDeleteVertexArraysOES,
            J: _glDetachShader,
            i: _glDisable,
            Ba: _glDrawElements,
            j: _glEnable,
            u: _glEnableVertexAttribArray,
            G: _glGenBuffers,
            xa: _glGenTextures,
            Ca: _glGenVertexArraysOES,
            v: _glGetAttribLocation,
            e: _glGetIntegerv,
            la: _glGetProgramInfoLog,
            D: _glGetProgramiv,
            na: _glGetShaderInfoLog,
            E: _glGetShaderiv,
            Da: _glGetString,
            H: _glGetUniformLocation,
            l: _glIsEnabled,
            za: _glIsProgram,
            ta: _glLinkProgram,
            R: _glScissor,
            M: _glShaderSource,
            wa: _glTexImage2D,
            n: _glTexParameteri,
            pa: _glUniform1i,
            oa: _glUniformMatrix4fv,
            Q: _glUseProgram,
            t: _glVertexAttribPointer,
            O: _glViewport,
            V: _proc_exit,
        };
        var wasmExports = createWasm();
        var ___wasm_call_ctors = () => (___wasm_call_ctors = wasmExports["Ha"])();
        var _malloc = (a0) => (_malloc = wasmExports["Ia"])(a0);
        var _free = (a0) => (_free = wasmExports["Ja"])(a0);
        var ___getTypeName = (a0) => (___getTypeName = wasmExports["Ka"])(a0);
        var __emscripten_timeout = (a0, a1) => (__emscripten_timeout = wasmExports["Ma"])(a0, a1);
        Module["FS"] = FS;
        Module["MEMFS"] = MEMFS;
        Module["GL"] = GL;
        var calledRun;
        dependenciesFulfilled = function runCaller() {
            if (!calledRun) run();
            if (!calledRun) dependenciesFulfilled = runCaller;
        };
        function run() {
            if (runDependencies > 0) {
                return;
            }
            preRun();
            if (runDependencies > 0) {
                return;
            }
            function doRun() {
                if (calledRun) return;
                calledRun = true;
                Module["calledRun"] = true;
                if (ABORT) return;
                initRuntime();
                readyPromiseResolve(Module);
                Module["onRuntimeInitialized"]?.();
                postRun();
            }
            if (Module["setStatus"]) {
                Module["setStatus"]("Running...");
                setTimeout(() => {
                    setTimeout(() => Module["setStatus"](""), 1);
                    doRun();
                }, 1);
            } else {
                doRun();
            }
        }
        if (Module["preInit"]) {
            if (typeof Module["preInit"] == "function") Module["preInit"] = [Module["preInit"]];
            while (Module["preInit"].length > 0) {
                Module["preInit"].pop()();
            }
        }
        run();
        moduleRtn = readyPromise;

        return moduleRtn;
    };
})();
export default MainExport;
