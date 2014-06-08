/**
 * @author khiraiwa
 */

function start() {
   // [1, 2, 3].forEach(alert);
    console.log(doubleAll(nums));
    console.log(average(nums));
    console.log(_.reduce(nums, function(a, b) {return a+b;}));
    console.log(onlyEven(nums));
    console.log(_.map({a:1, b:2}, _.identity));
    console.log(_.map({a:1, b:2}, function(v, k) { return [k, v]; }));
    
    console.log(cat([1,2,3], [4,5], [6,7,8]));
    console.log(mapcat(function(e) {
    	return construct(e, [","]);
    }, [1, 2, 3]));
    
    
    var people = [{name: "Fred", age: 65}, {name: "Lucy", age: 36}];
    console.log(_.max([1, 2, 4.5]));
    console.log(_.max(people, function(p) {return p.age;}));
    
    var add100 = makeAdder(100);
    console.log(add100(10));
    console.log(add100(11));
    
    var str = dispatch(invoker('toString', Array.prototype.toString),
    					invoker('toString', String.prototype.toString));
    console.log(str("a"));
    console.log(str(_.range(10)));
    
    var polyrev = dispatch(invoker('reverse', Array.prototype.reverse),
    		stringReverse);
    console.log(polyrev([1, 2, 3]));
    console.log(polyrev("abc"));
}

function splat(fun) {
	return function(array) {
		return fun.apply(null, array);
	};
}

var nums = [1, 2, 3, 4, 5];

function doubleAll(array) {
	return _.map(array, function(n){return n*2;});
}

function average(array) {
	var sum = _.reduce(array, function(a, b) {return a+b;});
	return sum / _.size(array);
}

function onlyEven(array) {
	return _.filter(array, function(n) {
		return (n%2) === 0;// ===は厳密等価演算子
	});
}

function existy(x) {
	return x != null;
}

function truthy(x) {
	return (x !== false) && existy(x);
};

// 要素と配列を引数にとり、、配列の前に要素を挿入する
function construct(head, tail) {
	return cat([head], _.toArray(tail));
}

function cat() {
	// first(array, [n])
	// 配列arrayの最初の要素を返す
	// 数値nを指定すると、最初のｎ個の要素を返す
	var head = _.first(arguments);
	if (existy(head))
		// a.concat(b) a配列の末尾にbを要素として追加する。
		return head.concat.apply(head, _.rest(arguments));
	else
		return [];
}

function mapcat(fun, coll) {
	return cat.apply(null, _.map(coll, fun));
}

function makeAdder(num) {
	return function (m) {
		return num + m;
	};
}

function doWhen(cond, action) {
	if (truthy(cond))
		return action();
	else 
		return undefined;
}

function invoker(name, method) {
	return function (target) {
		if (!existy(target)) fail("Must provide a target");
		
		var targetMethod = target[name];
		var args = _.rest(arguments);
		
		return doWhen((existy(targetMethod) && method === targetMethod), function() {
			return targetMethod.apply(target, args);
		});
	};
}

// 一つ以上の関数を引数にとり、それらの関数をundefined以外の値が
// 返されるまで順番に呼び出す
function dispatch() {
	var funs = _.toArray(arguments);
	var size = funs.length;
	return function(target) {
		var ret = undefined;
		// rest(array, [index])
		// 配列arrayから最初の要素を取り除いた配列を返す
		// indexを指定した場合はindexとそれ以降の祖嘘を含んだ配列を返す
		var args = _.rest(arguments);
		for (var funIndex = 0; funIndex < size; funIndex++) {
			var fun = funs[funIndex];
			// [関数].apply([オブジェクト], [引数])
			// オブジェクト.[関数]([引数])とすることができる関数。[オブジェクト]をnullとしても使える。
			ret = fun.apply(null, construct(target, args));
			// fun.fun(construct(target, args));
			if (existy(ret)) return ret;
		}
		return ret;
	};
}

function stringReverse(s) {
	if (!_.isString(s)) return undefined;
	
	return s.split('').reverse().join("");
}