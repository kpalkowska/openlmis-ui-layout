describe('PodViewController', function() {

    var vm, $rootScope, $state, $q, podSpy, notificationServiceMock, confirmServiceMock, confirmPromise;

    beforeEach(function() {
        notificationServiceMock = jasmine.createSpyObj('notificationService', ['success', 'error']);
        confirmServiceMock = jasmine.createSpyObj('confirmService', ['confirm']);
        podServiceMock = jasmine.createSpyObj('podService', ['save', 'submit']);
        podSpy = jasmine.createSpyObj('pod', ['$isPodValid', '$isLineItemValid']);

        module('proof-of-delivery-view', function($provide) {
            $provide.service('notificationService', function() {
                return notificationServiceMock;
            });

            $provide.service('confirmService', function() {
                return confirmServiceMock;
            });

            $provide.service('podService', function() {
                return podServiceMock;
            });
        });

        inject(function(_$rootScope_, _$state_, _$q_, $controller) {
            $rootScope = _$rootScope_;
            $state = _$state_;
            $q = _$q_;

            vm = $controller('PodViewController', {
                pod: podSpy
            });
        });

        spyOn($state, 'reload').andReturn();

        confirmPromise = $q.when();
        confirmServiceMock.confirm.andReturn(confirmPromise);
    });

    it('initialization should expose pod', function() {
        expect(vm.pod).toEqual(podSpy);
    });

    describe('savePod', function() {

        var deferred;

        beforeEach(function() {
            deferred = $q.defer();
            podServiceMock.save.andReturn(deferred.promise);

            vm.savePod();
            $rootScope.$apply();
        });

        it('should show confirmation modal', function() {
            expect(confirmServiceMock.confirm).toHaveBeenCalledWith('msg.orders.savePodQuestion');
        });

        it('should save pod', function() {
            expect(podServiceMock.save).toHaveBeenCalled();
        });

        it('should show success notification if save was successful', function() {
            deferred.resolve();
            $rootScope.$apply();

            expect(notificationServiceMock.success).toHaveBeenCalledWith('msg.podSaved');
        });

        it('should reload state if save was successful', function() {
            deferred.resolve();
            $rootScope.$apply();

            expect($state.reload).toHaveBeenCalled();
        });

        it('should show error notification if save failed', function() {
            deferred.reject();
            $rootScope.$apply();

            expect(notificationServiceMock.error).toHaveBeenCalledWith('msg.podSavedFailed');
        });

        it('should not reload state if save failed', function() {
            deferred.reject();
            $rootScope.$apply();

            expect($state.reload).not.toHaveBeenCalled();
        });

    });

    describe('submitPod', function() {

        var deferred;

        beforeEach(function() {
            deferred = $q.defer();
            podServiceMock.submit.andReturn(deferred.promise);

            vm.submitPod();
            $rootScope.$apply();
        });

        it('should show confirmation modal', function() {
            expect(confirmServiceMock.confirm).toHaveBeenCalledWith('msg.orders.submitPodQuestion');
        });

        it('should submit pod', function() {
            expect(podServiceMock.submit).toHaveBeenCalled();
        });

        it('should show success notification if save was successful', function() {
            deferred.resolve();
            $rootScope.$apply();

            expect(notificationServiceMock.success).toHaveBeenCalledWith('msg.podSubmit');
        });

        it('should reload state if save was successful', function() {
            deferred.resolve();
            $rootScope.$apply();

            expect($state.reload).toHaveBeenCalled();
        });

        it('should show error notification if save failed', function() {
            deferred.reject();
            $rootScope.$apply();

            expect(notificationServiceMock.error).toHaveBeenCalledWith('msg.podSubmitFailed');
        });

        it('should not reload state if save failed', function() {
            deferred.reject();
            $rootScope.$apply();

            expect($state.reload).not.toHaveBeenCalled();
        });

    });

    describe('periodDisplayName', function() {

        beforeEach(function() {
            podSpy.order = {
                processingPeriod: {
                    startDate: [2015, 5, 1],
                    endDate: [2015, 5, 31]
                }
            };
        });

        it('should parse period properly', function() {
            expect(vm.periodDisplayName()).toEqual('2015/5/1 - 2015/5/31');
        });

    });

    describe('typeMessage', function() {

        var order;

        beforeEach(function() {
            podSpy.order = {};
            order = podSpy.order;
        });

        it('should return emergency if pod order is emergency', function() {
            order.emergency = true;

            var result = vm.typeMessage();

            expect(result).toEqual('msg.emergency');
        });

        it('should return regular if pod order is not emergency', function() {
            order.emergency = false;

            var result = vm.typeMessage();

            expect(result).toEqual('msg.regular');
        });

    });

});