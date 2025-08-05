var MainExport = (() => {
    return async function (moduleArg = {}) {
        var moduleRtn;

        var Module = moduleArg;
        var readyPromiseResolve, readyPromiseReject;
        var readyPromise = new Promise((resolve, reject) => {
            readyPromiseResolve = resolve;
            readyPromiseReject = reject;
        });
        var ENVIRONMENT_IS_WEB = true;
        var ENVIRONMENT_IS_WORKER = false;
        var arguments_ = [];
        var thisProgram = "./this.program";
        var quit_ = (status, toThrow) => {
            throw toThrow;
        };
        var _scriptName = import.meta.url;
        var scriptDirectory = "";
        function locateFile(path) {
            if (Module["locateFile"]) {
                return Module["locateFile"](path, scriptDirectory);
            }
            return scriptDirectory + path;
        }
        var readAsync, readBinary;
        if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
            try {
                scriptDirectory = new URL(".", _scriptName).href;
            } catch {}
            {
                readAsync = async (url) => {
                    var response = await fetch(url, { credentials: "same-origin" });
                    if (response.ok) {
                        return response.arrayBuffer();
                    }
                    throw new Error(response.status + " : " + response.url);
                };
            }
        } else {
        }
        var out = console.log.bind(console);
        var err = console.error.bind(console);
        var wasmBinary;
        var wasmMemory;
        var ABORT = false;
        var EXITSTATUS;
        var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAP64, HEAPU64, HEAPF64;
        var runtimeInitialized = false;
        function updateMemoryViews() {
            var b = wasmMemory.buffer;
            HEAP8 = new Int8Array(b);
            HEAP16 = new Int16Array(b);
            HEAPU8 = new Uint8Array(b);
            HEAPU16 = new Uint16Array(b);
            HEAP32 = new Int32Array(b);
            HEAPU32 = new Uint32Array(b);
            HEAPF32 = new Float32Array(b);
            HEAPF64 = new Float64Array(b);
            HEAP64 = new BigInt64Array(b);
            HEAPU64 = new BigUint64Array(b);
        }
        function preRun() {
            if (Module["preRun"]) {
                if (typeof Module["preRun"] == "function") Module["preRun"] = [Module["preRun"]];
                while (Module["preRun"].length) {
                    addOnPreRun(Module["preRun"].shift());
                }
            }
            callRuntimeCallbacks(onPreRuns);
        }
        function initRuntime() {
            runtimeInitialized = true;
            if (!Module["noFSInit"] && !FS.initialized) FS.init();
            TTY.init();
            wasmExports["ub"]();
            FS.ignorePermissions = false;
        }
        function postRun() {
            if (Module["postRun"]) {
                if (typeof Module["postRun"] == "function") Module["postRun"] = [Module["postRun"]];
                while (Module["postRun"].length) {
                    addOnPostRun(Module["postRun"].shift());
                }
            }
            callRuntimeCallbacks(onPostRuns);
        }
        var runDependencies = 0;
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
        var wasmBinaryFile;
        function findWasmBinary() {
            if (Module["locateFile"]) {
                return locateFile("jsimgui-em.wasm");
            }
            return new URL("jsimgui-em.wasm", import.meta.url).href;
        }
        function getBinarySync(file) {
            if (file == wasmBinaryFile && wasmBinary) {
                return new Uint8Array(wasmBinary);
            }
            if (readBinary) {
                return readBinary(file);
            }
            throw "both async and sync fetching of the wasm failed";
        }
        async function getWasmBinary(binaryFile) {
            if (!wasmBinary) {
                try {
                    var response = await readAsync(binaryFile);
                    return new Uint8Array(response);
                } catch {}
            }
            return getBinarySync(binaryFile);
        }
        async function instantiateArrayBuffer(binaryFile, imports) {
            try {
                var binary = await getWasmBinary(binaryFile);
                var instance = await WebAssembly.instantiate(binary, imports);
                return instance;
            } catch (reason) {
                err(`failed to asynchronously prepare wasm: ${reason}`);
                abort(reason);
            }
        }
        async function instantiateAsync(binary, binaryFile, imports) {
            if (!binary && typeof WebAssembly.instantiateStreaming == "function") {
                try {
                    var response = fetch(binaryFile, { credentials: "same-origin" });
                    var instantiationResult = await WebAssembly.instantiateStreaming(
                        response,
                        imports,
                    );
                    return instantiationResult;
                } catch (reason) {
                    err(`wasm streaming compile failed: ${reason}`);
                    err("falling back to ArrayBuffer instantiation");
                }
            }
            return instantiateArrayBuffer(binaryFile, imports);
        }
        function getWasmImports() {
            return { a: wasmImports };
        }
        async function createWasm() {
            function receiveInstance(instance, module) {
                wasmExports = instance.exports;
                wasmMemory = wasmExports["tb"];
                updateMemoryViews();
                wasmTable = wasmExports["yb"];
                removeRunDependency("wasm-instantiate");
                return wasmExports;
            }
            addRunDependency("wasm-instantiate");
            function receiveInstantiationResult(result) {
                return receiveInstance(result["instance"]);
            }
            var info = getWasmImports();
            if (Module["instantiateWasm"]) {
                return new Promise((resolve, reject) => {
                    Module["instantiateWasm"](info, (mod, inst) => {
                        resolve(receiveInstance(mod, inst));
                    });
                });
            }
            wasmBinaryFile ??= findWasmBinary();
            try {
                var result = await instantiateAsync(wasmBinary, wasmBinaryFile, info);
                var exports = receiveInstantiationResult(result);
                return exports;
            } catch (e) {
                readyPromiseReject(e);
                return Promise.reject(e);
            }
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
        var onPostRuns = [];
        var addOnPostRun = (cb) => onPostRuns.push(cb);
        var onPreRuns = [];
        var addOnPreRun = (cb) => onPreRuns.push(cb);
        var noExitRuntime = true;
        var stackRestore = (val) => __emscripten_stack_restore(val);
        var stackSave = () => _emscripten_stack_get_current();
        var UTF8Decoder = new TextDecoder();
        var UTF8ToString = (ptr, maxBytesToRead) => {
            if (!ptr) return "";
            var maxPtr = ptr + maxBytesToRead;
            for (var end = ptr; !(end >= maxPtr) && HEAPU8[end]; ) ++end;
            return UTF8Decoder.decode(HEAPU8.subarray(ptr, end));
        };
        var ___assert_fail = (condition, filename, line, func) =>
            abort(
                `Assertion failed: ${UTF8ToString(condition)}, at: ` +
                    [
                        filename ? UTF8ToString(filename) : "unknown filename",
                        line,
                        func ? UTF8ToString(func) : "unknown function",
                    ],
            );
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
                    trailingSlash = path.slice(-1) === "/";
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
                    dir = dir.slice(0, -1);
                }
                return root + dir;
            },
            basename: (path) => path && path.match(/([^\/]+|\/)\/*$/)[1],
            join: (...paths) => PATH.normalize(paths.join("/")),
            join2: (l, r) => PATH.normalize(l + "/" + r),
        };
        var initRandomFill = () => (view) => crypto.getRandomValues(view);
        var randomFill = (view) => {
            (randomFill = initRandomFill())(view);
        };
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
                from = PATH_FS.resolve(from).slice(1);
                to = PATH_FS.resolve(to).slice(1);
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
        var UTF8ArrayToString = (heapOrArray, idx = 0, maxBytesToRead = NaN) => {
            var endIdx = idx + maxBytesToRead;
            var endPtr = idx;
            while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr;
            return UTF8Decoder.decode(
                heapOrArray.buffer
                    ? heapOrArray.subarray(idx, endPtr)
                    : new Uint8Array(heapOrArray.slice(idx, endPtr)),
            );
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
        var intArrayFromString = (stringy, dontAddNull, length) => {
            var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
            var u8array = new Array(len);
            var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
            if (dontAddNull) u8array.length = numBytesWritten;
            return u8array;
        };
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
                        stream.node.atime = Date.now();
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
                        stream.node.mtime = stream.node.ctime = Date.now();
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
                    if (tty.output?.length > 0) {
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
                    if (tty.output?.length > 0) {
                        err(UTF8ArrayToString(tty.output));
                        tty.output = [];
                    }
                },
            },
        };
        var zeroMemory = (ptr, size) => HEAPU8.fill(0, ptr, ptr + size);
        var alignMemory = (size, alignment) => Math.ceil(size / alignment) * alignment;
        var mmapAlloc = (size) => {
            size = alignMemory(size, 65536);
            var ptr = _emscripten_builtin_memalign(65536, size);
            if (ptr) zeroMemory(ptr, size);
            return ptr;
        };
        var MEMFS = {
            ops_table: null,
            mount(mount) {
                return MEMFS.createNode(null, "/", 16895, 0);
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
                node.atime = node.mtime = node.ctime = Date.now();
                if (parent) {
                    parent.contents[name] = node;
                    parent.atime = parent.mtime = parent.ctime = node.atime;
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
                    attr.atime = new Date(node.atime);
                    attr.mtime = new Date(node.mtime);
                    attr.ctime = new Date(node.ctime);
                    attr.blksize = 4096;
                    attr.blocks = Math.ceil(attr.size / attr.blksize);
                    return attr;
                },
                setattr(node, attr) {
                    for (const key of ["mode", "atime", "mtime", "ctime"]) {
                        if (attr[key] != null) {
                            node[key] = attr[key];
                        }
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
                    var new_node;
                    try {
                        new_node = FS.lookupNode(new_dir, new_name);
                    } catch (e) {}
                    if (new_node) {
                        if (FS.isDir(old_node.mode)) {
                            for (var i in new_node.contents) {
                                throw new FS.ErrnoError(55);
                            }
                        }
                        FS.hashRemoveNode(new_node);
                    }
                    delete old_node.parent.contents[old_node.name];
                    new_dir.contents[new_name] = old_node;
                    old_node.name = new_name;
                    new_dir.ctime =
                        new_dir.mtime =
                        old_node.parent.ctime =
                        old_node.parent.mtime =
                            Date.now();
                },
                unlink(parent, name) {
                    delete parent.contents[name];
                    parent.ctime = parent.mtime = Date.now();
                },
                rmdir(parent, name) {
                    var node = FS.lookupNode(parent, name);
                    for (var i in node.contents) {
                        throw new FS.ErrnoError(55);
                    }
                    delete parent.contents[name];
                    parent.ctime = parent.mtime = Date.now();
                },
                readdir(node) {
                    return [".", "..", ...Object.keys(node.contents)];
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
                    node.mtime = node.ctime = Date.now();
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
        var asyncLoad = async (url) => {
            var arrayBuffer = await readAsync(url);
            return new Uint8Array(arrayBuffer);
        };
        var FS_createDataFile = (...args) => FS.createDataFile(...args);
        var preloadPlugins = [];
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
                asyncLoad(url).then(processData, onerror);
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
            filesystems: null,
            syncFSRequests: 0,
            readFiles: {},
            ErrnoError: class {
                name = "ErrnoError";
                constructor(errno) {
                    this.errno = errno;
                }
            },
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
                    this.atime = this.mtime = this.ctime = Date.now();
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
                if (!path) {
                    throw new FS.ErrnoError(44);
                }
                opts.follow_mount ??= true;
                if (!PATH.isAbs(path)) {
                    path = FS.cwd() + "/" + path;
                }
                linkloop: for (var nlinks = 0; nlinks < 40; nlinks++) {
                    var parts = path.split("/").filter((p) => !!p);
                    var current = FS.root;
                    var current_path = "/";
                    for (var i = 0; i < parts.length; i++) {
                        var islast = i === parts.length - 1;
                        if (islast && opts.parent) {
                            break;
                        }
                        if (parts[i] === ".") {
                            continue;
                        }
                        if (parts[i] === "..") {
                            current_path = PATH.dirname(current_path);
                            if (FS.isRoot(current)) {
                                path = current_path + "/" + parts.slice(i + 1).join("/");
                                continue linkloop;
                            } else {
                                current = current.parent;
                            }
                            continue;
                        }
                        current_path = PATH.join2(current_path, parts[i]);
                        try {
                            current = FS.lookupNode(current, parts[i]);
                        } catch (e) {
                            if (e?.errno === 44 && islast && opts.noent_okay) {
                                return { path: current_path };
                            }
                            throw e;
                        }
                        if (FS.isMountpoint(current) && (!islast || opts.follow_mount)) {
                            current = current.mounted.root;
                        }
                        if (FS.isLink(current.mode) && (!islast || opts.follow)) {
                            if (!current.node_ops.readlink) {
                                throw new FS.ErrnoError(52);
                            }
                            var link = current.node_ops.readlink(current);
                            if (!PATH.isAbs(link)) {
                                link = PATH.dirname(current_path) + "/" + link;
                            }
                            path = link + "/" + parts.slice(i + 1).join("/");
                            continue linkloop;
                        }
                    }
                    return { path: current_path, node: current };
                }
                throw new FS.ErrnoError(32);
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
                if (!FS.isDir(dir.mode)) {
                    return 54;
                }
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
                    if (FS.flagsToPermissionString(flags) !== "r" || flags & (512 | 64)) {
                        return 31;
                    }
                }
                return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
            },
            checkOpExists(op, err) {
                if (!op) {
                    throw new FS.ErrnoError(err);
                }
                return op;
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
            doSetAttr(stream, node, attr) {
                var setattr = stream?.stream_ops.setattr;
                var arg = setattr ? stream : node;
                setattr ??= node.node_ops.setattr;
                FS.checkOpExists(setattr, 63);
                setattr(arg, attr);
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
                if (!name) {
                    throw new FS.ErrnoError(28);
                }
                if (name === "." || name === "..") {
                    throw new FS.ErrnoError(20);
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
            statfs(path) {
                return FS.statfsNode(FS.lookupPath(path, { follow: true }).node);
            },
            statfsStream(stream) {
                return FS.statfsNode(stream.node);
            },
            statfsNode(node) {
                var rtn = {
                    bsize: 4096,
                    frsize: 4096,
                    blocks: 1e6,
                    bfree: 5e5,
                    bavail: 5e5,
                    files: FS.nextInode,
                    ffree: FS.nextInode - 1,
                    fsid: 42,
                    flags: 2,
                    namelen: 255,
                };
                if (node.node_ops.statfs) {
                    Object.assign(rtn, node.node_ops.statfs(node.mount.opts.root));
                }
                return rtn;
            },
            create(path, mode = 438) {
                mode &= 4095;
                mode |= 32768;
                return FS.mknod(path, mode, 0);
            },
            mkdir(path, mode = 511) {
                mode &= 511 | 512;
                mode |= 16384;
                return FS.mknod(path, mode, 0);
            },
            mkdirTree(path, mode) {
                var dirs = path.split("/");
                var d = "";
                for (var dir of dirs) {
                    if (!dir) continue;
                    if (d || PATH.isAbs(path)) d += "/";
                    d += dir;
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
                var readdir = FS.checkOpExists(node.node_ops.readdir, 54);
                return readdir(node);
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
                return link.node_ops.readlink(link);
            },
            stat(path, dontFollow) {
                var lookup = FS.lookupPath(path, { follow: !dontFollow });
                var node = lookup.node;
                var getattr = FS.checkOpExists(node.node_ops.getattr, 63);
                return getattr(node);
            },
            fstat(fd) {
                var stream = FS.getStreamChecked(fd);
                var node = stream.node;
                var getattr = stream.stream_ops.getattr;
                var arg = getattr ? stream : node;
                getattr ??= node.node_ops.getattr;
                FS.checkOpExists(getattr, 63);
                return getattr(arg);
            },
            lstat(path) {
                return FS.stat(path, true);
            },
            doChmod(stream, node, mode, dontFollow) {
                FS.doSetAttr(stream, node, {
                    mode: (mode & 4095) | (node.mode & ~4095),
                    ctime: Date.now(),
                    dontFollow,
                });
            },
            chmod(path, mode, dontFollow) {
                var node;
                if (typeof path == "string") {
                    var lookup = FS.lookupPath(path, { follow: !dontFollow });
                    node = lookup.node;
                } else {
                    node = path;
                }
                FS.doChmod(null, node, mode, dontFollow);
            },
            lchmod(path, mode) {
                FS.chmod(path, mode, true);
            },
            fchmod(fd, mode) {
                var stream = FS.getStreamChecked(fd);
                FS.doChmod(stream, stream.node, mode, false);
            },
            doChown(stream, node, dontFollow) {
                FS.doSetAttr(stream, node, { timestamp: Date.now(), dontFollow });
            },
            chown(path, uid, gid, dontFollow) {
                var node;
                if (typeof path == "string") {
                    var lookup = FS.lookupPath(path, { follow: !dontFollow });
                    node = lookup.node;
                } else {
                    node = path;
                }
                FS.doChown(null, node, dontFollow);
            },
            lchown(path, uid, gid) {
                FS.chown(path, uid, gid, true);
            },
            fchown(fd, uid, gid) {
                var stream = FS.getStreamChecked(fd);
                FS.doChown(stream, stream.node, false);
            },
            doTruncate(stream, node, len) {
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
                FS.doSetAttr(stream, node, { size: len, timestamp: Date.now() });
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
                FS.doTruncate(null, node, len);
            },
            ftruncate(fd, len) {
                var stream = FS.getStreamChecked(fd);
                if (len < 0 || (stream.flags & 2097155) === 0) {
                    throw new FS.ErrnoError(28);
                }
                FS.doTruncate(stream, stream.node, len);
            },
            utime(path, atime, mtime) {
                var lookup = FS.lookupPath(path, { follow: true });
                var node = lookup.node;
                var setattr = FS.checkOpExists(node.node_ops.setattr, 63);
                setattr(node, { atime, mtime });
            },
            open(path, flags, mode = 438) {
                if (path === "") {
                    throw new FS.ErrnoError(44);
                }
                flags = typeof flags == "string" ? FS_modeStringToFlags(flags) : flags;
                if (flags & 64) {
                    mode = (mode & 4095) | 32768;
                } else {
                    mode = 0;
                }
                var node;
                var isDirPath;
                if (typeof path == "object") {
                    node = path;
                } else {
                    isDirPath = path.endsWith("/");
                    var lookup = FS.lookupPath(path, {
                        follow: !(flags & 131072),
                        noent_okay: true,
                    });
                    node = lookup.node;
                    path = lookup.path;
                }
                var created = false;
                if (flags & 64) {
                    if (node) {
                        if (flags & 128) {
                            throw new FS.ErrnoError(20);
                        }
                    } else if (isDirPath) {
                        throw new FS.ErrnoError(31);
                    } else {
                        node = FS.mknod(path, mode | 511, 0);
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
                if (created) {
                    FS.chmod(node, mode & 511);
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
                        randomFill(randomBuffer);
                        randomLeft = randomBuffer.byteLength;
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
                            var node = FS.createNode(proc_self, "fd", 16895, 73);
                            node.stream_ops = { llseek: MEMFS.stream_ops.llseek };
                            node.node_ops = {
                                lookup(parent, name) {
                                    var fd = +name;
                                    var stream = FS.getStreamChecked(fd);
                                    var ret = {
                                        parent: null,
                                        mount: { mountpoint: "fake" },
                                        node_ops: { readlink: () => stream.path },
                                        id: fd + 1,
                                    };
                                    ret.parent = ret;
                                    return ret;
                                },
                                readdir() {
                                    return Array.from(FS.streams.entries())
                                        .filter(([k, v]) => v)
                                        .map(([k, v]) => k.toString());
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
                for (var stream of FS.streams) {
                    if (stream) {
                        FS.close(stream);
                    }
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
                    } catch (e) {
                        if (e.errno != 20) throw e;
                    }
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
                            stream.node.atime = Date.now();
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
                            stream.node.mtime = stream.node.ctime = Date.now();
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
                return dir + "/" + path;
            },
            writeStat(buf, stat) {
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
            writeStatFs(buf, stats) {
                HEAP32[(buf + 4) >> 2] = stats.bsize;
                HEAP32[(buf + 40) >> 2] = stats.bsize;
                HEAP32[(buf + 8) >> 2] = stats.blocks;
                HEAP32[(buf + 12) >> 2] = stats.bfree;
                HEAP32[(buf + 16) >> 2] = stats.bavail;
                HEAP32[(buf + 20) >> 2] = stats.files;
                HEAP32[(buf + 24) >> 2] = stats.ffree;
                HEAP32[(buf + 28) >> 2] = stats.fsid;
                HEAP32[(buf + 44) >> 2] = stats.flags;
                HEAP32[(buf + 36) >> 2] = stats.namelen;
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
        function ___syscall_fstat64(fd, buf) {
            try {
                return SYSCALLS.writeStat(buf, FS.fstat(fd));
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
        var __abort_js = () => abort("");
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
        var BindingError = class BindingError extends Error {
            constructor(message) {
                super(message);
                this.name = "BindingError";
            }
        };
        var throwBindingError = (message) => {
            throw new BindingError(message);
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
            const isUnsignedType = minRange === 0n;
            let fromWireType = (value) => value;
            if (isUnsignedType) {
                const bitSize = size * 8;
                fromWireType = (value) => BigInt.asUintN(bitSize, value);
                maxRange = fromWireType(maxRange);
            }
            registerType(primitiveType, {
                name,
                fromWireType,
                toWireType: (destructors, value) => {
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
            let proto = ClassHandle.prototype;
            Object.assign(proto, {
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
            const symbolDispose = Symbol.dispose;
            if (symbolDispose) {
                proto[symbolDispose] = proto["delete"];
            }
        };
        function ClassHandle() {}
        var createNamedFunction = (name, func) =>
            Object.defineProperty(func, "name", { value: name });
        var registeredPointers = {};
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
        var InternalError = class InternalError extends Error {
            constructor(message) {
                super(message);
                this.name = "InternalError";
            }
        };
        var throwInternalError = (message) => {
            throw new InternalError(message);
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
        var embind__requireFunction = (signature, rawFunction, isAsync = false) => {
            signature = readLatin1String(signature);
            function makeDynCaller() {
                var rtn = getWasmTableEntry(rawFunction);
                return rtn;
            }
            var fp = makeDynCaller();
            if (typeof fp != "function") {
                throwBindingError(
                    `unknown function pointer with signature ${signature}: ${rawFunction}`,
                );
            }
            return fp;
        };
        class UnboundTypeError extends Error {}
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
                            throw new BindingError(`Use 'new' to construct ${name}`);
                        }
                        if (undefined === registeredClass.constructor_body) {
                            throw new BindingError(`${name} has no accessible constructor`);
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
            var invokerFn = new Function(...args, invokerFnBody)(...closureArgs);
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
            if (argsIndex === -1) return signature;
            return signature.slice(0, argsIndex);
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
            rawInvoker = embind__requireFunction(invokerSignature, rawInvoker, isAsync);
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
        var emval_handles = [0, 1, , 1, null, 1, true, 1, false, 1];
        var __emval_decref = (handle) => {
            if (handle > 9 && 0 === --emval_handles[handle + 1]) {
                emval_handles[handle] = undefined;
                emval_freelist.push(handle);
            }
        };
        var Emval = {
            toValue: (handle) => {
                if (!handle) {
                    throwBindingError(`Cannot use deleted val. handle = ${handle}`);
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
            rawInvoker = embind__requireFunction(signature, rawInvoker, isAsync);
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
            const isUnsignedType = minRange === 0;
            let fromWireType = (value) => value;
            if (isUnsignedType) {
                var bitshift = 32 - 8 * size;
                fromWireType = (value) => (value << bitshift) >>> bitshift;
                maxRange = fromWireType(maxRange);
            }
            registerType(primitiveType, {
                name,
                fromWireType,
                toWireType: (destructors, value) => value,
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
            var stdStringIsUTF8 = true;
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
                            (ArrayBuffer.isView(value) && value.BYTES_PER_ELEMENT == 1)
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
                    if (valueIsOfTypeString) {
                        if (stdStringIsUTF8) {
                            stringToUTF8(value, ptr, length + 1);
                        } else {
                            for (var i = 0; i < length; ++i) {
                                var charCode = value.charCodeAt(i);
                                if (charCode > 255) {
                                    _free(base);
                                    throwBindingError(
                                        "String has UTF-16 code units that do not fit in 8 bits",
                                    );
                                }
                                HEAPU8[ptr + i] = charCode;
                            }
                        }
                    } else {
                        HEAPU8.set(value, ptr);
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
        var UTF16Decoder = new TextDecoder("utf-16le");
        var UTF16ToString = (ptr, maxBytesToRead) => {
            var idx = ptr >> 1;
            var maxIdx = idx + maxBytesToRead / 2;
            var endIdx = idx;
            while (!(endIdx >= maxIdx) && HEAPU16[endIdx]) ++endIdx;
            return UTF16Decoder.decode(HEAPU16.subarray(idx, endIdx));
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
        var __emscripten_throw_longjmp = () => {
            throw Infinity;
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
        var INT53_MAX = 9007199254740992;
        var INT53_MIN = -9007199254740992;
        var bigintToI53Checked = (num) => (num < INT53_MIN || num > INT53_MAX ? NaN : Number(num));
        function __mmap_js(len, prot, flags, fd, offset, allocated, addr) {
            offset = bigintToI53Checked(offset);
            try {
                var stream = SYSCALLS.getStreamFromFD(fd);
                var res = FS.mmap(stream, len, offset, prot, flags);
                var ptr = res.ptr;
                HEAP32[allocated >> 2] = res.allocated;
                HEAPU32[addr >> 2] = ptr;
                return 0;
            } catch (e) {
                if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
                return -e.errno;
            }
        }
        function __munmap_js(addr, len, prot, flags, fd, offset) {
            offset = bigintToI53Checked(offset);
            try {
                var stream = SYSCALLS.getStreamFromFD(fd);
                if (prot & 2) {
                    SYSCALLS.doMsync(addr, stream, len, flags, offset);
                }
            } catch (e) {
                if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
                return -e.errno;
            }
        }
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
        var stackAlloc = (sz) => __emscripten_stack_alloc(sz);
        var stringToUTF8OnStack = (str) => {
            var size = lengthBytesUTF8(str) + 1;
            var ret = stackAlloc(size);
            stringToUTF8(str, ret, size);
            return ret;
        };
        var WebGPU = {
            errorCallback: (callback, type, message, userdata) => {
                var sp = stackSave();
                var messagePtr = stringToUTF8OnStack(message);
                getWasmTableEntry(callback)(type, messagePtr, userdata);
                stackRestore(sp);
            },
            initManagers: () => {
                function Manager() {
                    this.objects = {};
                    this.nextId = 1;
                    this.create = function (object, wrapper = {}) {
                        var id = this.nextId++;
                        wrapper.refcount = 1;
                        wrapper.object = object;
                        this.objects[id] = wrapper;
                        return id;
                    };
                    this.get = function (id) {
                        if (!id) return undefined;
                        var o = this.objects[id];
                        return o.object;
                    };
                    this.reference = function (id) {
                        var o = this.objects[id];
                        o.refcount++;
                    };
                    this.release = function (id) {
                        var o = this.objects[id];
                        o.refcount--;
                        if (o.refcount <= 0) {
                            delete this.objects[id];
                        }
                    };
                }
                WebGPU.mgrSurface = new Manager();
                WebGPU.mgrSwapChain = new Manager();
                WebGPU.mgrAdapter = new Manager();
                WebGPU.mgrDevice = new Manager();
                WebGPU.mgrQueue = new Manager();
                WebGPU.mgrCommandBuffer = new Manager();
                WebGPU.mgrCommandEncoder = new Manager();
                WebGPU.mgrRenderPassEncoder = new Manager();
                WebGPU.mgrComputePassEncoder = new Manager();
                WebGPU.mgrBindGroup = new Manager();
                WebGPU.mgrBuffer = new Manager();
                WebGPU.mgrSampler = new Manager();
                WebGPU.mgrTexture = new Manager();
                WebGPU.mgrTextureView = new Manager();
                WebGPU.mgrQuerySet = new Manager();
                WebGPU.mgrBindGroupLayout = new Manager();
                WebGPU.mgrPipelineLayout = new Manager();
                WebGPU.mgrRenderPipeline = new Manager();
                WebGPU.mgrComputePipeline = new Manager();
                WebGPU.mgrShaderModule = new Manager();
                WebGPU.mgrRenderBundleEncoder = new Manager();
                WebGPU.mgrRenderBundle = new Manager();
            },
            makeColor: (ptr) => ({
                r: HEAPF64[ptr >> 3],
                g: HEAPF64[(ptr + 8) >> 3],
                b: HEAPF64[(ptr + 16) >> 3],
                a: HEAPF64[(ptr + 24) >> 3],
            }),
            makeExtent3D: (ptr) => ({
                width: HEAPU32[ptr >> 2],
                height: HEAPU32[(ptr + 4) >> 2],
                depthOrArrayLayers: HEAPU32[(ptr + 8) >> 2],
            }),
            makeOrigin3D: (ptr) => ({
                x: HEAPU32[ptr >> 2],
                y: HEAPU32[(ptr + 4) >> 2],
                z: HEAPU32[(ptr + 8) >> 2],
            }),
            makeImageCopyTexture: (ptr) => ({
                texture: WebGPU.mgrTexture.get(HEAPU32[(ptr + 4) >> 2]),
                mipLevel: HEAPU32[(ptr + 8) >> 2],
                origin: WebGPU.makeOrigin3D(ptr + 12),
                aspect: WebGPU.TextureAspect[HEAPU32[(ptr + 24) >> 2]],
            }),
            makeTextureDataLayout: (ptr) => {
                var bytesPerRow = HEAPU32[(ptr + 16) >> 2];
                var rowsPerImage = HEAPU32[(ptr + 20) >> 2];
                return {
                    offset: HEAPU32[(ptr + 4 + 8) >> 2] * 4294967296 + HEAPU32[(ptr + 8) >> 2],
                    bytesPerRow: bytesPerRow === 4294967295 ? undefined : bytesPerRow,
                    rowsPerImage: rowsPerImage === 4294967295 ? undefined : rowsPerImage,
                };
            },
            makeImageCopyBuffer: (ptr) => {
                var layoutPtr = ptr + 8;
                var bufferCopyView = WebGPU.makeTextureDataLayout(layoutPtr);
                bufferCopyView["buffer"] = WebGPU.mgrBuffer.get(HEAPU32[(ptr + 32) >> 2]);
                return bufferCopyView;
            },
            makePipelineConstants: (constantCount, constantsPtr) => {
                if (!constantCount) return;
                var constants = {};
                for (var i = 0; i < constantCount; ++i) {
                    var entryPtr = constantsPtr + 16 * i;
                    var key = UTF8ToString(HEAPU32[(entryPtr + 4) >> 2]);
                    constants[key] = HEAPF64[(entryPtr + 8) >> 3];
                }
                return constants;
            },
            makePipelineLayout: (layoutPtr) => {
                if (!layoutPtr) return "auto";
                return WebGPU.mgrPipelineLayout.get(layoutPtr);
            },
            makeProgrammableStageDescriptor: (ptr) => {
                if (!ptr) return undefined;
                var desc = {
                    module: WebGPU.mgrShaderModule.get(HEAPU32[(ptr + 4) >> 2]),
                    constants: WebGPU.makePipelineConstants(
                        HEAPU32[(ptr + 12) >> 2],
                        HEAPU32[(ptr + 16) >> 2],
                    ),
                };
                var entryPointPtr = HEAPU32[(ptr + 8) >> 2];
                if (entryPointPtr) desc["entryPoint"] = UTF8ToString(entryPointPtr);
                return desc;
            },
            fillLimitStruct: (limits, supportedLimitsOutPtr) => {
                var limitsOutPtr = supportedLimitsOutPtr + 8;
                function setLimitValueU32(name, limitOffset) {
                    var limitValue = limits[name];
                    HEAP32[(limitsOutPtr + limitOffset) >> 2] = limitValue;
                }
                function setLimitValueU64(name, limitOffset) {
                    var limitValue = limits[name];
                    HEAP64[(limitsOutPtr + limitOffset) >> 3] = BigInt(limitValue);
                }
                setLimitValueU32("maxTextureDimension1D", 0);
                setLimitValueU32("maxTextureDimension2D", 4);
                setLimitValueU32("maxTextureDimension3D", 8);
                setLimitValueU32("maxTextureArrayLayers", 12);
                setLimitValueU32("maxBindGroups", 16);
                setLimitValueU32("maxBindGroupsPlusVertexBuffers", 20);
                setLimitValueU32("maxBindingsPerBindGroup", 24);
                setLimitValueU32("maxDynamicUniformBuffersPerPipelineLayout", 28);
                setLimitValueU32("maxDynamicStorageBuffersPerPipelineLayout", 32);
                setLimitValueU32("maxSampledTexturesPerShaderStage", 36);
                setLimitValueU32("maxSamplersPerShaderStage", 40);
                setLimitValueU32("maxStorageBuffersPerShaderStage", 44);
                setLimitValueU32("maxStorageTexturesPerShaderStage", 48);
                setLimitValueU32("maxUniformBuffersPerShaderStage", 52);
                setLimitValueU32("minUniformBufferOffsetAlignment", 72);
                setLimitValueU32("minStorageBufferOffsetAlignment", 76);
                setLimitValueU64("maxUniformBufferBindingSize", 56);
                setLimitValueU64("maxStorageBufferBindingSize", 64);
                setLimitValueU32("maxVertexBuffers", 80);
                setLimitValueU64("maxBufferSize", 88);
                setLimitValueU32("maxVertexAttributes", 96);
                setLimitValueU32("maxVertexBufferArrayStride", 100);
                setLimitValueU32("maxInterStageShaderComponents", 104);
                setLimitValueU32("maxInterStageShaderVariables", 108);
                setLimitValueU32("maxColorAttachments", 112);
                setLimitValueU32("maxColorAttachmentBytesPerSample", 116);
                setLimitValueU32("maxComputeWorkgroupStorageSize", 120);
                setLimitValueU32("maxComputeInvocationsPerWorkgroup", 124);
                setLimitValueU32("maxComputeWorkgroupSizeX", 128);
                setLimitValueU32("maxComputeWorkgroupSizeY", 132);
                setLimitValueU32("maxComputeWorkgroupSizeZ", 136);
                setLimitValueU32("maxComputeWorkgroupsPerDimension", 140);
            },
            Int_BufferMapState: { unmapped: 1, pending: 2, mapped: 3 },
            Int_CompilationMessageType: { error: 1, warning: 2, info: 3 },
            Int_DeviceLostReason: { undefined: 1, unknown: 1, destroyed: 2 },
            Int_PreferredFormat: { rgba8unorm: 18, bgra8unorm: 23 },
            WGSLFeatureName: [
                ,
                "readonly_and_readwrite_storage_textures",
                "packed_4x8_integer_dot_product",
                "unrestricted_pointer_parameters",
                "pointer_composite_access",
            ],
            AddressMode: [, "clamp-to-edge", "repeat", "mirror-repeat"],
            AlphaMode: [, "opaque", "premultiplied"],
            BlendFactor: [
                ,
                "zero",
                "one",
                "src",
                "one-minus-src",
                "src-alpha",
                "one-minus-src-alpha",
                "dst",
                "one-minus-dst",
                "dst-alpha",
                "one-minus-dst-alpha",
                "src-alpha-saturated",
                "constant",
                "one-minus-constant",
            ],
            BlendOperation: [, "add", "subtract", "reverse-subtract", "min", "max"],
            BufferBindingType: [, "uniform", "storage", "read-only-storage"],
            BufferMapState: { 1: "unmapped", 2: "pending", 3: "mapped" },
            CompareFunction: [
                ,
                "never",
                "less",
                "equal",
                "less-equal",
                "greater",
                "not-equal",
                "greater-equal",
                "always",
            ],
            CompilationInfoRequestStatus: ["success", "error", "device-lost", "unknown"],
            CullMode: [, "none", "front", "back"],
            ErrorFilter: { 1: "validation", 2: "out-of-memory", 3: "internal" },
            FeatureName: [
                ,
                "depth-clip-control",
                "depth32float-stencil8",
                "timestamp-query",
                "texture-compression-bc",
                "texture-compression-etc2",
                "texture-compression-astc",
                "indirect-first-instance",
                "shader-f16",
                "rg11b10ufloat-renderable",
                "bgra8unorm-storage",
                "float32-filterable",
            ],
            FilterMode: [, "nearest", "linear"],
            FrontFace: [, "ccw", "cw"],
            IndexFormat: [, "uint16", "uint32"],
            LoadOp: [, "clear", "load"],
            MipmapFilterMode: [, "nearest", "linear"],
            PowerPreference: [, "low-power", "high-performance"],
            PrimitiveTopology: [
                ,
                "point-list",
                "line-list",
                "line-strip",
                "triangle-list",
                "triangle-strip",
            ],
            QueryType: { 1: "occlusion", 2: "timestamp" },
            SamplerBindingType: [, "filtering", "non-filtering", "comparison"],
            StencilOperation: [
                ,
                "keep",
                "zero",
                "replace",
                "invert",
                "increment-clamp",
                "decrement-clamp",
                "increment-wrap",
                "decrement-wrap",
            ],
            StorageTextureAccess: [, "write-only", "read-only", "read-write"],
            StoreOp: [, "store", "discard"],
            TextureAspect: [, "all", "stencil-only", "depth-only"],
            TextureDimension: [, "1d", "2d", "3d"],
            TextureFormat: [
                ,
                "r8unorm",
                "r8snorm",
                "r8uint",
                "r8sint",
                "r16uint",
                "r16sint",
                "r16float",
                "rg8unorm",
                "rg8snorm",
                "rg8uint",
                "rg8sint",
                "r32float",
                "r32uint",
                "r32sint",
                "rg16uint",
                "rg16sint",
                "rg16float",
                "rgba8unorm",
                "rgba8unorm-srgb",
                "rgba8snorm",
                "rgba8uint",
                "rgba8sint",
                "bgra8unorm",
                "bgra8unorm-srgb",
                "rgb10a2uint",
                "rgb10a2unorm",
                "rg11b10ufloat",
                "rgb9e5ufloat",
                "rg32float",
                "rg32uint",
                "rg32sint",
                "rgba16uint",
                "rgba16sint",
                "rgba16float",
                "rgba32float",
                "rgba32uint",
                "rgba32sint",
                "stencil8",
                "depth16unorm",
                "depth24plus",
                "depth24plus-stencil8",
                "depth32float",
                "depth32float-stencil8",
                "bc1-rgba-unorm",
                "bc1-rgba-unorm-srgb",
                "bc2-rgba-unorm",
                "bc2-rgba-unorm-srgb",
                "bc3-rgba-unorm",
                "bc3-rgba-unorm-srgb",
                "bc4-r-unorm",
                "bc4-r-snorm",
                "bc5-rg-unorm",
                "bc5-rg-snorm",
                "bc6h-rgb-ufloat",
                "bc6h-rgb-float",
                "bc7-rgba-unorm",
                "bc7-rgba-unorm-srgb",
                "etc2-rgb8unorm",
                "etc2-rgb8unorm-srgb",
                "etc2-rgb8a1unorm",
                "etc2-rgb8a1unorm-srgb",
                "etc2-rgba8unorm",
                "etc2-rgba8unorm-srgb",
                "eac-r11unorm",
                "eac-r11snorm",
                "eac-rg11unorm",
                "eac-rg11snorm",
                "astc-4x4-unorm",
                "astc-4x4-unorm-srgb",
                "astc-5x4-unorm",
                "astc-5x4-unorm-srgb",
                "astc-5x5-unorm",
                "astc-5x5-unorm-srgb",
                "astc-6x5-unorm",
                "astc-6x5-unorm-srgb",
                "astc-6x6-unorm",
                "astc-6x6-unorm-srgb",
                "astc-8x5-unorm",
                "astc-8x5-unorm-srgb",
                "astc-8x6-unorm",
                "astc-8x6-unorm-srgb",
                "astc-8x8-unorm",
                "astc-8x8-unorm-srgb",
                "astc-10x5-unorm",
                "astc-10x5-unorm-srgb",
                "astc-10x6-unorm",
                "astc-10x6-unorm-srgb",
                "astc-10x8-unorm",
                "astc-10x8-unorm-srgb",
                "astc-10x10-unorm",
                "astc-10x10-unorm-srgb",
                "astc-12x10-unorm",
                "astc-12x10-unorm-srgb",
                "astc-12x12-unorm",
                "astc-12x12-unorm-srgb",
            ],
            TextureSampleType: [, "float", "unfilterable-float", "depth", "sint", "uint"],
            TextureViewDimension: [, "1d", "2d", "2d-array", "cube", "cube-array", "3d"],
            VertexFormat: [
                ,
                "uint8x2",
                "uint8x4",
                "sint8x2",
                "sint8x4",
                "unorm8x2",
                "unorm8x4",
                "snorm8x2",
                "snorm8x4",
                "uint16x2",
                "uint16x4",
                "sint16x2",
                "sint16x4",
                "unorm16x2",
                "unorm16x4",
                "snorm16x2",
                "snorm16x4",
                "float16x2",
                "float16x4",
                "float32",
                "float32x2",
                "float32x3",
                "float32x4",
                "uint32",
                "uint32x2",
                "uint32x3",
                "uint32x4",
                "sint32",
                "sint32x2",
                "sint32x3",
                "sint32x4",
                "unorm10-10-10-2",
            ],
            VertexStepMode: [, "vertex-buffer-not-used", "vertex", "instance"],
            FeatureNameString2Enum: {
                undefined: "0",
                "depth-clip-control": "1",
                "depth32float-stencil8": "2",
                "timestamp-query": "3",
                "texture-compression-bc": "4",
                "texture-compression-etc2": "5",
                "texture-compression-astc": "6",
                "indirect-first-instance": "7",
                "shader-f16": "8",
                "rg11b10ufloat-renderable": "9",
                "bgra8unorm-storage": "10",
                "float32-filterable": "11",
            },
        };
        var _emscripten_webgpu_get_device = () => {
            if (WebGPU.preinitializedDeviceId === undefined) {
                var device = Module["preinitializedWebGPUDevice"];
                var deviceWrapper = { queueId: WebGPU.mgrQueue.create(device["queue"]) };
                WebGPU.preinitializedDeviceId = WebGPU.mgrDevice.create(device, deviceWrapper);
            }
            WebGPU.mgrDevice.reference(WebGPU.preinitializedDeviceId);
            return WebGPU.preinitializedDeviceId;
        };
        var JsValStore = {
            values: {},
            next_id: 1,
            add(js_val) {
                var id;
                do {
                    id = JsValStore.next_id++;
                    if (JsValStore.next_id > 2147483647) JsValStore.next_id = 1;
                } while (id in JsValStore.values);
                JsValStore.values[id] = js_val;
                return id;
            },
            remove(id) {
                delete JsValStore.values[id];
            },
            get(id) {
                return JsValStore.values[id];
            },
        };
        var _emscripten_webgpu_import_render_pass_encoder = (handle) =>
            WebGPU.mgrRenderPassEncoder.create(JsValStore.get(handle));
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
        var _environ_get = (__environ, environ_buf) => {
            var bufSize = 0;
            var envp = 0;
            for (var string of getEnvStrings()) {
                var ptr = environ_buf + bufSize;
                HEAPU32[(__environ + envp) >> 2] = ptr;
                bufSize += stringToUTF8(string, ptr, Infinity) + 1;
                envp += 4;
            }
            return 0;
        };
        var _environ_sizes_get = (penviron_count, penviron_buf_size) => {
            var strings = getEnvStrings();
            HEAPU32[penviron_count >> 2] = strings.length;
            var bufSize = 0;
            for (var string of strings) {
                bufSize += lengthBytesUTF8(string) + 1;
            }
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
                Module["ctx"] = GLctx = GL.currentContext?.GLctx;
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
                if (GL.contexts[contextHandle]?.GLctx.canvas) {
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
        var webglGetExtensions = () => {
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
        var _glTexSubImage2D = (
            target,
            level,
            xoffset,
            yoffset,
            width,
            height,
            format,
            type,
            pixels,
        ) => {
            if (true) {
                if (GLctx.currentPixelUnpackBufferBinding) {
                    GLctx.texSubImage2D(
                        target,
                        level,
                        xoffset,
                        yoffset,
                        width,
                        height,
                        format,
                        type,
                        pixels,
                    );
                    return;
                }
                if (pixels) {
                    var heap = heapObjectForWebGLType(type);
                    GLctx.texSubImage2D(
                        target,
                        level,
                        xoffset,
                        yoffset,
                        width,
                        height,
                        format,
                        type,
                        heap,
                        toTypedArrayIndex(pixels, heap),
                    );
                    return;
                }
            }
            var pixelData = pixels
                ? emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, 0)
                : null;
            GLctx.texSubImage2D(
                target,
                level,
                xoffset,
                yoffset,
                width,
                height,
                format,
                type,
                pixelData,
            );
        };
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
        var _wgpuBindGroupLayoutRelease = (id) => WebGPU.mgrBindGroupLayout.release(id);
        var _wgpuBindGroupRelease = (id) => WebGPU.mgrBindGroup.release(id);
        var _wgpuBufferDestroy = (bufferId) => {
            var bufferWrapper = WebGPU.mgrBuffer.objects[bufferId];
            if (bufferWrapper.onUnmap) {
                for (var f of bufferWrapper.onUnmap) {
                    f();
                }
                bufferWrapper.onUnmap = undefined;
            }
            WebGPU.mgrBuffer.get(bufferId).destroy();
        };
        var _wgpuBufferRelease = (id) => WebGPU.mgrBuffer.release(id);
        var readI53FromI64 = (ptr) => HEAPU32[ptr >> 2] + HEAP32[(ptr + 4) >> 2] * 4294967296;
        var _wgpuDeviceCreateBindGroup = (deviceId, descriptor) => {
            function makeEntry(entryPtr) {
                var bufferId = HEAPU32[(entryPtr + 8) >> 2];
                var samplerId = HEAPU32[(entryPtr + 32) >> 2];
                var textureViewId = HEAPU32[(entryPtr + 36) >> 2];
                var binding = HEAPU32[(entryPtr + 4) >> 2];
                if (bufferId) {
                    var size = readI53FromI64(entryPtr + 24);
                    if (size == -1) size = undefined;
                    return {
                        binding,
                        resource: {
                            buffer: WebGPU.mgrBuffer.get(bufferId),
                            offset:
                                HEAPU32[(entryPtr + 4 + 16) >> 2] * 4294967296 +
                                HEAPU32[(entryPtr + 16) >> 2],
                            size,
                        },
                    };
                } else if (samplerId) {
                    return { binding, resource: WebGPU.mgrSampler.get(samplerId) };
                } else {
                    return { binding, resource: WebGPU.mgrTextureView.get(textureViewId) };
                }
            }
            function makeEntries(count, entriesPtrs) {
                var entries = [];
                for (var i = 0; i < count; ++i) {
                    entries.push(makeEntry(entriesPtrs + 40 * i));
                }
                return entries;
            }
            var desc = {
                label: undefined,
                layout: WebGPU.mgrBindGroupLayout.get(HEAPU32[(descriptor + 8) >> 2]),
                entries: makeEntries(
                    HEAPU32[(descriptor + 12) >> 2],
                    HEAPU32[(descriptor + 16) >> 2],
                ),
            };
            var labelPtr = HEAPU32[(descriptor + 4) >> 2];
            if (labelPtr) desc["label"] = UTF8ToString(labelPtr);
            var device = WebGPU.mgrDevice.get(deviceId);
            return WebGPU.mgrBindGroup.create(device.createBindGroup(desc));
        };
        var _wgpuDeviceCreateBindGroupLayout = (deviceId, descriptor) => {
            function makeBufferEntry(entryPtr) {
                var typeInt = HEAPU32[(entryPtr + 4) >> 2];
                if (!typeInt) return undefined;
                return {
                    type: WebGPU.BufferBindingType[typeInt],
                    hasDynamicOffset: !!HEAPU32[(entryPtr + 8) >> 2],
                    minBindingSize:
                        HEAPU32[(entryPtr + 4 + 16) >> 2] * 4294967296 +
                        HEAPU32[(entryPtr + 16) >> 2],
                };
            }
            function makeSamplerEntry(entryPtr) {
                var typeInt = HEAPU32[(entryPtr + 4) >> 2];
                if (!typeInt) return undefined;
                return { type: WebGPU.SamplerBindingType[typeInt] };
            }
            function makeTextureEntry(entryPtr) {
                var sampleTypeInt = HEAPU32[(entryPtr + 4) >> 2];
                if (!sampleTypeInt) return undefined;
                return {
                    sampleType: WebGPU.TextureSampleType[sampleTypeInt],
                    viewDimension: WebGPU.TextureViewDimension[HEAPU32[(entryPtr + 8) >> 2]],
                    multisampled: !!HEAPU32[(entryPtr + 12) >> 2],
                };
            }
            function makeStorageTextureEntry(entryPtr) {
                var accessInt = HEAPU32[(entryPtr + 4) >> 2];
                if (!accessInt) return undefined;
                return {
                    access: WebGPU.StorageTextureAccess[accessInt],
                    format: WebGPU.TextureFormat[HEAPU32[(entryPtr + 8) >> 2]],
                    viewDimension: WebGPU.TextureViewDimension[HEAPU32[(entryPtr + 12) >> 2]],
                };
            }
            function makeEntry(entryPtr) {
                return {
                    binding: HEAPU32[(entryPtr + 4) >> 2],
                    visibility: HEAPU32[(entryPtr + 8) >> 2],
                    buffer: makeBufferEntry(entryPtr + 16),
                    sampler: makeSamplerEntry(entryPtr + 40),
                    texture: makeTextureEntry(entryPtr + 48),
                    storageTexture: makeStorageTextureEntry(entryPtr + 64),
                };
            }
            function makeEntries(count, entriesPtrs) {
                var entries = [];
                for (var i = 0; i < count; ++i) {
                    entries.push(makeEntry(entriesPtrs + 80 * i));
                }
                return entries;
            }
            var desc = {
                entries: makeEntries(
                    HEAPU32[(descriptor + 8) >> 2],
                    HEAPU32[(descriptor + 12) >> 2],
                ),
            };
            var labelPtr = HEAPU32[(descriptor + 4) >> 2];
            if (labelPtr) desc["label"] = UTF8ToString(labelPtr);
            var device = WebGPU.mgrDevice.get(deviceId);
            return WebGPU.mgrBindGroupLayout.create(device.createBindGroupLayout(desc));
        };
        var _wgpuDeviceCreateBuffer = (deviceId, descriptor) => {
            var mappedAtCreation = !!HEAPU32[(descriptor + 24) >> 2];
            var desc = {
                label: undefined,
                usage: HEAPU32[(descriptor + 8) >> 2],
                size:
                    HEAPU32[(descriptor + 4 + 16) >> 2] * 4294967296 +
                    HEAPU32[(descriptor + 16) >> 2],
                mappedAtCreation,
            };
            var labelPtr = HEAPU32[(descriptor + 4) >> 2];
            if (labelPtr) desc["label"] = UTF8ToString(labelPtr);
            var device = WebGPU.mgrDevice.get(deviceId);
            var bufferWrapper = {};
            var id = WebGPU.mgrBuffer.create(device.createBuffer(desc), bufferWrapper);
            if (mappedAtCreation) {
                bufferWrapper.mapMode = 2;
                bufferWrapper.onUnmap = [];
            }
            return id;
        };
        var _wgpuDeviceCreatePipelineLayout = (deviceId, descriptor) => {
            var bglCount = HEAPU32[(descriptor + 8) >> 2];
            var bglPtr = HEAPU32[(descriptor + 12) >> 2];
            var bgls = [];
            for (var i = 0; i < bglCount; ++i) {
                bgls.push(WebGPU.mgrBindGroupLayout.get(HEAPU32[(bglPtr + 4 * i) >> 2]));
            }
            var desc = { label: undefined, bindGroupLayouts: bgls };
            var labelPtr = HEAPU32[(descriptor + 4) >> 2];
            if (labelPtr) desc["label"] = UTF8ToString(labelPtr);
            var device = WebGPU.mgrDevice.get(deviceId);
            return WebGPU.mgrPipelineLayout.create(device.createPipelineLayout(desc));
        };
        var generateRenderPipelineDesc = (descriptor) => {
            function makePrimitiveState(rsPtr) {
                if (!rsPtr) return undefined;
                var nextInChainPtr = HEAPU32[rsPtr >> 2];
                var sType = nextInChainPtr ? HEAPU32[(nextInChainPtr + 4) >> 2] : 0;
                return {
                    topology: WebGPU.PrimitiveTopology[HEAPU32[(rsPtr + 4) >> 2]],
                    stripIndexFormat: WebGPU.IndexFormat[HEAPU32[(rsPtr + 8) >> 2]],
                    frontFace: WebGPU.FrontFace[HEAPU32[(rsPtr + 12) >> 2]],
                    cullMode: WebGPU.CullMode[HEAPU32[(rsPtr + 16) >> 2]],
                    unclippedDepth: sType === 7 && !!HEAPU32[(nextInChainPtr + 8) >> 2],
                };
            }
            function makeBlendComponent(bdPtr) {
                if (!bdPtr) return undefined;
                return {
                    operation: WebGPU.BlendOperation[HEAPU32[bdPtr >> 2]],
                    srcFactor: WebGPU.BlendFactor[HEAPU32[(bdPtr + 4) >> 2]],
                    dstFactor: WebGPU.BlendFactor[HEAPU32[(bdPtr + 8) >> 2]],
                };
            }
            function makeBlendState(bsPtr) {
                if (!bsPtr) return undefined;
                return {
                    alpha: makeBlendComponent(bsPtr + 12),
                    color: makeBlendComponent(bsPtr + 0),
                };
            }
            function makeColorState(csPtr) {
                var formatInt = HEAPU32[(csPtr + 4) >> 2];
                return formatInt === 0
                    ? undefined
                    : {
                          format: WebGPU.TextureFormat[formatInt],
                          blend: makeBlendState(HEAPU32[(csPtr + 8) >> 2]),
                          writeMask: HEAPU32[(csPtr + 12) >> 2],
                      };
            }
            function makeColorStates(count, csArrayPtr) {
                var states = [];
                for (var i = 0; i < count; ++i) {
                    states.push(makeColorState(csArrayPtr + 16 * i));
                }
                return states;
            }
            function makeStencilStateFace(ssfPtr) {
                return {
                    compare: WebGPU.CompareFunction[HEAPU32[ssfPtr >> 2]],
                    failOp: WebGPU.StencilOperation[HEAPU32[(ssfPtr + 4) >> 2]],
                    depthFailOp: WebGPU.StencilOperation[HEAPU32[(ssfPtr + 8) >> 2]],
                    passOp: WebGPU.StencilOperation[HEAPU32[(ssfPtr + 12) >> 2]],
                };
            }
            function makeDepthStencilState(dssPtr) {
                if (!dssPtr) return undefined;
                return {
                    format: WebGPU.TextureFormat[HEAPU32[(dssPtr + 4) >> 2]],
                    depthWriteEnabled: !!HEAPU32[(dssPtr + 8) >> 2],
                    depthCompare: WebGPU.CompareFunction[HEAPU32[(dssPtr + 12) >> 2]],
                    stencilFront: makeStencilStateFace(dssPtr + 16),
                    stencilBack: makeStencilStateFace(dssPtr + 32),
                    stencilReadMask: HEAPU32[(dssPtr + 48) >> 2],
                    stencilWriteMask: HEAPU32[(dssPtr + 52) >> 2],
                    depthBias: HEAP32[(dssPtr + 56) >> 2],
                    depthBiasSlopeScale: HEAPF32[(dssPtr + 60) >> 2],
                    depthBiasClamp: HEAPF32[(dssPtr + 64) >> 2],
                };
            }
            function makeVertexAttribute(vaPtr) {
                return {
                    format: WebGPU.VertexFormat[HEAPU32[vaPtr >> 2]],
                    offset: HEAPU32[(vaPtr + 4 + 8) >> 2] * 4294967296 + HEAPU32[(vaPtr + 8) >> 2],
                    shaderLocation: HEAPU32[(vaPtr + 16) >> 2],
                };
            }
            function makeVertexAttributes(count, vaArrayPtr) {
                var vas = [];
                for (var i = 0; i < count; ++i) {
                    vas.push(makeVertexAttribute(vaArrayPtr + i * 24));
                }
                return vas;
            }
            function makeVertexBuffer(vbPtr) {
                if (!vbPtr) return undefined;
                var stepModeInt = HEAPU32[(vbPtr + 8) >> 2];
                return stepModeInt === 1
                    ? null
                    : {
                          arrayStride: HEAPU32[(vbPtr + 4) >> 2] * 4294967296 + HEAPU32[vbPtr >> 2],
                          stepMode: WebGPU.VertexStepMode[stepModeInt],
                          attributes: makeVertexAttributes(
                              HEAPU32[(vbPtr + 12) >> 2],
                              HEAPU32[(vbPtr + 16) >> 2],
                          ),
                      };
            }
            function makeVertexBuffers(count, vbArrayPtr) {
                if (!count) return undefined;
                var vbs = [];
                for (var i = 0; i < count; ++i) {
                    vbs.push(makeVertexBuffer(vbArrayPtr + i * 24));
                }
                return vbs;
            }
            function makeVertexState(viPtr) {
                if (!viPtr) return undefined;
                var desc = {
                    module: WebGPU.mgrShaderModule.get(HEAPU32[(viPtr + 4) >> 2]),
                    constants: WebGPU.makePipelineConstants(
                        HEAPU32[(viPtr + 12) >> 2],
                        HEAPU32[(viPtr + 16) >> 2],
                    ),
                    buffers: makeVertexBuffers(
                        HEAPU32[(viPtr + 20) >> 2],
                        HEAPU32[(viPtr + 24) >> 2],
                    ),
                };
                var entryPointPtr = HEAPU32[(viPtr + 8) >> 2];
                if (entryPointPtr) desc["entryPoint"] = UTF8ToString(entryPointPtr);
                return desc;
            }
            function makeMultisampleState(msPtr) {
                if (!msPtr) return undefined;
                return {
                    count: HEAPU32[(msPtr + 4) >> 2],
                    mask: HEAPU32[(msPtr + 8) >> 2],
                    alphaToCoverageEnabled: !!HEAPU32[(msPtr + 12) >> 2],
                };
            }
            function makeFragmentState(fsPtr) {
                if (!fsPtr) return undefined;
                var desc = {
                    module: WebGPU.mgrShaderModule.get(HEAPU32[(fsPtr + 4) >> 2]),
                    constants: WebGPU.makePipelineConstants(
                        HEAPU32[(fsPtr + 12) >> 2],
                        HEAPU32[(fsPtr + 16) >> 2],
                    ),
                    targets: makeColorStates(
                        HEAPU32[(fsPtr + 20) >> 2],
                        HEAPU32[(fsPtr + 24) >> 2],
                    ),
                };
                var entryPointPtr = HEAPU32[(fsPtr + 8) >> 2];
                if (entryPointPtr) desc["entryPoint"] = UTF8ToString(entryPointPtr);
                return desc;
            }
            var desc = {
                label: undefined,
                layout: WebGPU.makePipelineLayout(HEAPU32[(descriptor + 8) >> 2]),
                vertex: makeVertexState(descriptor + 12),
                primitive: makePrimitiveState(descriptor + 40),
                depthStencil: makeDepthStencilState(HEAPU32[(descriptor + 60) >> 2]),
                multisample: makeMultisampleState(descriptor + 64),
                fragment: makeFragmentState(HEAPU32[(descriptor + 80) >> 2]),
            };
            var labelPtr = HEAPU32[(descriptor + 4) >> 2];
            if (labelPtr) desc["label"] = UTF8ToString(labelPtr);
            return desc;
        };
        var _wgpuDeviceCreateRenderPipeline = (deviceId, descriptor) => {
            var desc = generateRenderPipelineDesc(descriptor);
            var device = WebGPU.mgrDevice.get(deviceId);
            return WebGPU.mgrRenderPipeline.create(device.createRenderPipeline(desc));
        };
        var _wgpuDeviceCreateSampler = (deviceId, descriptor) => {
            var desc;
            if (descriptor) {
                desc = {
                    label: undefined,
                    addressModeU: WebGPU.AddressMode[HEAPU32[(descriptor + 8) >> 2]],
                    addressModeV: WebGPU.AddressMode[HEAPU32[(descriptor + 12) >> 2]],
                    addressModeW: WebGPU.AddressMode[HEAPU32[(descriptor + 16) >> 2]],
                    magFilter: WebGPU.FilterMode[HEAPU32[(descriptor + 20) >> 2]],
                    minFilter: WebGPU.FilterMode[HEAPU32[(descriptor + 24) >> 2]],
                    mipmapFilter: WebGPU.MipmapFilterMode[HEAPU32[(descriptor + 28) >> 2]],
                    lodMinClamp: HEAPF32[(descriptor + 32) >> 2],
                    lodMaxClamp: HEAPF32[(descriptor + 36) >> 2],
                    compare: WebGPU.CompareFunction[HEAPU32[(descriptor + 40) >> 2]],
                };
                var labelPtr = HEAPU32[(descriptor + 4) >> 2];
                if (labelPtr) desc["label"] = UTF8ToString(labelPtr);
            }
            var device = WebGPU.mgrDevice.get(deviceId);
            return WebGPU.mgrSampler.create(device.createSampler(desc));
        };
        var _wgpuDeviceCreateShaderModule = (deviceId, descriptor) => {
            var nextInChainPtr = HEAPU32[descriptor >> 2];
            var sType = HEAPU32[(nextInChainPtr + 4) >> 2];
            var desc = { label: undefined, code: "" };
            var labelPtr = HEAPU32[(descriptor + 4) >> 2];
            if (labelPtr) desc["label"] = UTF8ToString(labelPtr);
            switch (sType) {
                case 5: {
                    var count = HEAPU32[(nextInChainPtr + 8) >> 2];
                    var start = HEAPU32[(nextInChainPtr + 12) >> 2];
                    var offset = start >> 2;
                    desc["code"] = HEAPU32.subarray(offset, offset + count);
                    break;
                }
                case 6: {
                    var sourcePtr = HEAPU32[(nextInChainPtr + 8) >> 2];
                    if (sourcePtr) {
                        desc["code"] = UTF8ToString(sourcePtr);
                    }
                    break;
                }
            }
            var device = WebGPU.mgrDevice.get(deviceId);
            return WebGPU.mgrShaderModule.create(device.createShaderModule(desc));
        };
        var _wgpuDeviceCreateTexture = (deviceId, descriptor) => {
            var desc = {
                label: undefined,
                size: WebGPU.makeExtent3D(descriptor + 16),
                mipLevelCount: HEAPU32[(descriptor + 32) >> 2],
                sampleCount: HEAPU32[(descriptor + 36) >> 2],
                dimension: WebGPU.TextureDimension[HEAPU32[(descriptor + 12) >> 2]],
                format: WebGPU.TextureFormat[HEAPU32[(descriptor + 28) >> 2]],
                usage: HEAPU32[(descriptor + 8) >> 2],
            };
            var labelPtr = HEAPU32[(descriptor + 4) >> 2];
            if (labelPtr) desc["label"] = UTF8ToString(labelPtr);
            var viewFormatCount = HEAPU32[(descriptor + 40) >> 2];
            if (viewFormatCount) {
                var viewFormatsPtr = HEAPU32[(descriptor + 44) >> 2];
                desc["viewFormats"] = Array.from(
                    HEAP32.subarray(
                        viewFormatsPtr >> 2,
                        (viewFormatsPtr + viewFormatCount * 4) >> 2,
                    ),
                    (format) => WebGPU.TextureFormat[format],
                );
            }
            var device = WebGPU.mgrDevice.get(deviceId);
            return WebGPU.mgrTexture.create(device.createTexture(desc));
        };
        var _wgpuDeviceGetQueue = (deviceId) => {
            var queueId = WebGPU.mgrDevice.objects[deviceId].queueId;
            WebGPU.mgrQueue.reference(queueId);
            return queueId;
        };
        var _wgpuPipelineLayoutRelease = (id) => WebGPU.mgrPipelineLayout.release(id);
        var _wgpuQueueRelease = (id) => WebGPU.mgrQueue.release(id);
        function _wgpuQueueWriteBuffer(queueId, bufferId, bufferOffset, data, size) {
            bufferOffset = bigintToI53Checked(bufferOffset);
            var queue = WebGPU.mgrQueue.get(queueId);
            var buffer = WebGPU.mgrBuffer.get(bufferId);
            var subarray = HEAPU8.subarray(data, data + size);
            queue.writeBuffer(buffer, bufferOffset, subarray, 0, size);
        }
        var _wgpuQueueWriteTexture = (
            queueId,
            destinationPtr,
            data,
            dataSize,
            dataLayoutPtr,
            writeSizePtr,
        ) => {
            var queue = WebGPU.mgrQueue.get(queueId);
            var destination = WebGPU.makeImageCopyTexture(destinationPtr);
            var dataLayout = WebGPU.makeTextureDataLayout(dataLayoutPtr);
            var writeSize = WebGPU.makeExtent3D(writeSizePtr);
            var subarray = HEAPU8.subarray(data, data + dataSize);
            queue.writeTexture(destination, subarray, dataLayout, writeSize);
        };
        var _wgpuRenderPassEncoderDrawIndexed = (
            passId,
            indexCount,
            instanceCount,
            firstIndex,
            baseVertex,
            firstInstance,
        ) => {
            var pass = WebGPU.mgrRenderPassEncoder.get(passId);
            pass.drawIndexed(indexCount, instanceCount, firstIndex, baseVertex, firstInstance);
        };
        var _wgpuRenderPassEncoderSetBindGroup = (
            passId,
            groupIndex,
            groupId,
            dynamicOffsetCount,
            dynamicOffsetsPtr,
        ) => {
            var pass = WebGPU.mgrRenderPassEncoder.get(passId);
            var group = WebGPU.mgrBindGroup.get(groupId);
            if (dynamicOffsetCount == 0) {
                pass.setBindGroup(groupIndex, group);
            } else {
                var offsets = [];
                for (var i = 0; i < dynamicOffsetCount; i++, dynamicOffsetsPtr += 4) {
                    offsets.push(HEAPU32[dynamicOffsetsPtr >> 2]);
                }
                pass.setBindGroup(groupIndex, group, offsets);
            }
        };
        var _wgpuRenderPassEncoderSetBlendConstant = (passId, colorPtr) => {
            var pass = WebGPU.mgrRenderPassEncoder.get(passId);
            var color = WebGPU.makeColor(colorPtr);
            pass.setBlendConstant(color);
        };
        function _wgpuRenderPassEncoderSetIndexBuffer(passId, bufferId, format, offset, size) {
            offset = bigintToI53Checked(offset);
            size = bigintToI53Checked(size);
            var pass = WebGPU.mgrRenderPassEncoder.get(passId);
            var buffer = WebGPU.mgrBuffer.get(bufferId);
            if (size == -1) size = undefined;
            pass.setIndexBuffer(buffer, WebGPU.IndexFormat[format], offset, size);
        }
        var _wgpuRenderPassEncoderSetPipeline = (passId, pipelineId) => {
            var pass = WebGPU.mgrRenderPassEncoder.get(passId);
            var pipeline = WebGPU.mgrRenderPipeline.get(pipelineId);
            pass.setPipeline(pipeline);
        };
        var _wgpuRenderPassEncoderSetScissorRect = (passId, x, y, w, h) => {
            var pass = WebGPU.mgrRenderPassEncoder.get(passId);
            pass.setScissorRect(x, y, w, h);
        };
        function _wgpuRenderPassEncoderSetVertexBuffer(passId, slot, bufferId, offset, size) {
            offset = bigintToI53Checked(offset);
            size = bigintToI53Checked(size);
            var pass = WebGPU.mgrRenderPassEncoder.get(passId);
            var buffer = WebGPU.mgrBuffer.get(bufferId);
            if (size == -1) size = undefined;
            pass.setVertexBuffer(slot, buffer, offset, size);
        }
        var _wgpuRenderPassEncoderSetViewport = (passId, x, y, w, h, minDepth, maxDepth) => {
            var pass = WebGPU.mgrRenderPassEncoder.get(passId);
            pass.setViewport(x, y, w, h, minDepth, maxDepth);
        };
        var _wgpuRenderPipelineRelease = (id) => WebGPU.mgrRenderPipeline.release(id);
        var _wgpuSamplerRelease = (id) => WebGPU.mgrSampler.release(id);
        var _wgpuShaderModuleRelease = (id) => WebGPU.mgrShaderModule.release(id);
        var _wgpuTextureCreateView = (textureId, descriptor) => {
            var desc;
            if (descriptor) {
                var mipLevelCount = HEAPU32[(descriptor + 20) >> 2];
                var arrayLayerCount = HEAPU32[(descriptor + 28) >> 2];
                desc = {
                    format: WebGPU.TextureFormat[HEAPU32[(descriptor + 8) >> 2]],
                    dimension: WebGPU.TextureViewDimension[HEAPU32[(descriptor + 12) >> 2]],
                    baseMipLevel: HEAPU32[(descriptor + 16) >> 2],
                    mipLevelCount: mipLevelCount === 4294967295 ? undefined : mipLevelCount,
                    baseArrayLayer: HEAPU32[(descriptor + 24) >> 2],
                    arrayLayerCount: arrayLayerCount === 4294967295 ? undefined : arrayLayerCount,
                    aspect: WebGPU.TextureAspect[HEAPU32[(descriptor + 32) >> 2]],
                };
                var labelPtr = HEAPU32[(descriptor + 4) >> 2];
                if (labelPtr) desc["label"] = UTF8ToString(labelPtr);
            }
            var texture = WebGPU.mgrTexture.get(textureId);
            return WebGPU.mgrTextureView.create(texture.createView(desc));
        };
        var _wgpuTextureRelease = (id) => WebGPU.mgrTexture.release(id);
        var _wgpuTextureViewRelease = (id) => WebGPU.mgrTextureView.release(id);
        FS.createPreloadedFile = FS_createPreloadedFile;
        FS.staticInit();
        MEMFS.doesNotExistError = new FS.ErrnoError(44);
        MEMFS.doesNotExistError.stack = "<generic error, no stack>";
        embind_init_charCodes();
        init_ClassHandle();
        init_RegisteredPointer();
        WebGPU.initManagers();
        {
            if (Module["noExitRuntime"]) noExitRuntime = Module["noExitRuntime"];
            if (Module["preloadPlugins"]) preloadPlugins = Module["preloadPlugins"];
            if (Module["print"]) out = Module["print"];
            if (Module["printErr"]) err = Module["printErr"];
            if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
            if (Module["arguments"]) arguments_ = Module["arguments"];
            if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
        }
        Module["FS"] = FS;
        Module["MEMFS"] = MEMFS;
        Module["GL"] = GL;
        Module["WebGPU"] = WebGPU;
        Module["JsValStore"] = JsValStore;
        var wasmImports = {
            a: ___assert_fail,
            aa: ___cxa_throw,
            z: ___syscall_fcntl64,
            nb: ___syscall_fstat64,
            pb: ___syscall_ioctl,
            Y: ___syscall_openat,
            ib: __abort_js,
            _: __embind_register_bigint,
            ca: __embind_register_bool,
            g: __embind_register_class,
            f: __embind_register_class_constructor,
            c: __embind_register_class_function,
            sb: __embind_register_emval,
            Z: __embind_register_float,
            b: __embind_register_function,
            h: __embind_register_integer,
            e: __embind_register_memory_view,
            ba: __embind_register_std_string,
            B: __embind_register_std_wstring,
            da: __embind_register_void,
            gb: __emscripten_runtime_keepalive_clear,
            eb: __emscripten_throw_longjmp,
            r: __emval_as,
            Ea: __emval_decref,
            la: __emval_get_global,
            $: __emval_get_property,
            va: __emval_instanceof,
            $a: __emval_new_cstring,
            ab: __emval_run_destructors,
            q: __emval_set_property,
            s: __emval_take_value,
            kb: __mmap_js,
            lb: __munmap_js,
            hb: __setitimer_js,
            jb: _emscripten_resize_heap,
            Za: _emscripten_webgpu_get_device,
            Ua: _emscripten_webgpu_import_render_pass_encoder,
            qb: _environ_get,
            rb: _environ_sizes_get,
            A: _fd_close,
            X: _fd_read,
            mb: _fd_seek,
            ob: _fd_write,
            W: _glActiveTexture,
            N: _glAttachShader,
            o: _glBindBuffer,
            k: _glBindTexture,
            y: _glBindVertexArrayOES,
            Ma: _glBlendEquation,
            Ta: _glBlendEquationSeparate,
            S: _glBlendFuncSeparate,
            p: _glBufferData,
            V: _glBufferSubData,
            Fa: _glClear,
            Ga: _glClearColor,
            O: _glCompileShader,
            Pa: _glCreateProgram,
            Q: _glCreateShader,
            I: _glDeleteBuffers,
            Na: _glDeleteProgram,
            L: _glDeleteShader,
            Ja: _glDeleteTextures,
            Wa: _glDeleteVertexArraysOES,
            M: _glDetachShader,
            i: _glDisable,
            Xa: _glDrawElements,
            j: _glEnable,
            w: _glEnableVertexAttribArray,
            J: _glGenBuffers,
            Sa: _glGenTextures,
            Ya: _glGenVertexArraysOES,
            x: _glGetAttribLocation,
            d: _glGetIntegerv,
            Ha: _glGetProgramInfoLog,
            G: _glGetProgramiv,
            Ia: _glGetShaderInfoLog,
            H: _glGetShaderiv,
            _a: _glGetString,
            K: _glGetUniformLocation,
            l: _glIsEnabled,
            Va: _glIsProgram,
            Oa: _glLinkProgram,
            U: _glScissor,
            P: _glShaderSource,
            Ra: _glTexImage2D,
            n: _glTexParameteri,
            Qa: _glTexSubImage2D,
            La: _glUniform1i,
            Ka: _glUniformMatrix4fv,
            T: _glUseProgram,
            v: _glVertexAttribPointer,
            R: _glViewport,
            db: invoke_iii,
            bb: invoke_iiii,
            cb: invoke_iiiii,
            fb: _proc_exit,
            ga: _wgpuBindGroupLayoutRelease,
            na: _wgpuBindGroupRelease,
            F: _wgpuBufferDestroy,
            u: _wgpuBufferRelease,
            C: _wgpuDeviceCreateBindGroup,
            D: _wgpuDeviceCreateBindGroupLayout,
            t: _wgpuDeviceCreateBuffer,
            ya: _wgpuDeviceCreatePipelineLayout,
            xa: _wgpuDeviceCreateRenderPipeline,
            wa: _wgpuDeviceCreateSampler,
            ja: _wgpuDeviceCreateShaderModule,
            Ba: _wgpuDeviceCreateTexture,
            ua: _wgpuDeviceGetQueue,
            ha: _wgpuPipelineLayoutRelease,
            ta: _wgpuQueueRelease,
            m: _wgpuQueueWriteBuffer,
            za: _wgpuQueueWriteTexture,
            Ca: _wgpuRenderPassEncoderDrawIndexed,
            E: _wgpuRenderPassEncoderSetBindGroup,
            oa: _wgpuRenderPassEncoderSetBlendConstant,
            qa: _wgpuRenderPassEncoderSetIndexBuffer,
            pa: _wgpuRenderPassEncoderSetPipeline,
            Da: _wgpuRenderPassEncoderSetScissorRect,
            ra: _wgpuRenderPassEncoderSetVertexBuffer,
            sa: _wgpuRenderPassEncoderSetViewport,
            fa: _wgpuRenderPipelineRelease,
            ea: _wgpuSamplerRelease,
            ia: _wgpuShaderModuleRelease,
            Aa: _wgpuTextureCreateView,
            ka: _wgpuTextureRelease,
            ma: _wgpuTextureViewRelease,
        };
        var wasmExports = await createWasm();
        var ___wasm_call_ctors = wasmExports["ub"];
        var _malloc = wasmExports["vb"];
        var _free = wasmExports["wb"];
        var ___getTypeName = wasmExports["xb"];
        var _emscripten_builtin_memalign = wasmExports["zb"];
        var __emscripten_timeout = wasmExports["Ab"];
        var _setThrew = wasmExports["Bb"];
        var __emscripten_stack_restore = wasmExports["Cb"];
        var __emscripten_stack_alloc = wasmExports["Db"];
        var _emscripten_stack_get_current = wasmExports["Eb"];
        function invoke_iii(index, a1, a2) {
            var sp = stackSave();
            try {
                return getWasmTableEntry(index)(a1, a2);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_iiiii(index, a1, a2, a3, a4) {
            var sp = stackSave();
            try {
                return getWasmTableEntry(index)(a1, a2, a3, a4);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_iiii(index, a1, a2, a3) {
            var sp = stackSave();
            try {
                return getWasmTableEntry(index)(a1, a2, a3);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function run() {
            if (runDependencies > 0) {
                dependenciesFulfilled = run;
                return;
            }
            preRun();
            if (runDependencies > 0) {
                dependenciesFulfilled = run;
                return;
            }
            function doRun() {
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
        function preInit() {
            if (Module["preInit"]) {
                if (typeof Module["preInit"] == "function") Module["preInit"] = [Module["preInit"]];
                while (Module["preInit"].length > 0) {
                    Module["preInit"].shift()();
                }
            }
        }
        preInit();
        run();
        moduleRtn = readyPromise;

        return moduleRtn;
    };
})();
export default MainExport;
