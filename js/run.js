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
		return (n%2) === 0;// ===�͌����������Z�q
	});
}

function existy(x) {
	return x != null;
}

function truthy(x) {
	return (x !== false) && existy(x);
};

// �v�f�Ɣz��������ɂƂ�A�A�z��̑O�ɗv�f��}������
function construct(head, tail) {
	return cat([head], _.toArray(tail));
}

function cat() {
	// first(array, [n])
	// �z��array�̍ŏ��̗v�f��Ԃ�
	// ���ln���w�肷��ƁA�ŏ��̂��̗v�f��Ԃ�
	var head = _.first(arguments);
	if (existy(head))
		// a.concat(b) a�z��̖�����b��v�f�Ƃ��Ēǉ�����B
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

// ��ȏ�̊֐��������ɂƂ�A�����̊֐���undefined�ȊO�̒l��
// �Ԃ����܂ŏ��ԂɌĂяo��
function dispatch() {
	var funs = _.toArray(arguments);
	var size = funs.length;
	return function(target) {
		var ret = undefined;
		// rest(array, [index])
		// �z��array����ŏ��̗v�f����菜�����z���Ԃ�
		// index���w�肵���ꍇ��index�Ƃ���ȍ~�̑c�R���܂񂾔z���Ԃ�
		var args = _.rest(arguments);
		for (var funIndex = 0; funIndex < size; funIndex++) {
			var fun = funs[funIndex];
			// [�֐�].apply([�I�u�W�F�N�g], [����])
			// �I�u�W�F�N�g.[�֐�]([����])�Ƃ��邱�Ƃ��ł���֐��B[�I�u�W�F�N�g]��null�Ƃ��Ă��g����B
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