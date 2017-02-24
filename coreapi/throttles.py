from rest_framework.throttling import AnonRateThrottle


class RegistrationBurstRateThrottle(AnonRateThrottle):
    rate = '5/min'


class RegistrationSustainedRateThrottle(AnonRateThrottle):
    rate = '10/hour'
