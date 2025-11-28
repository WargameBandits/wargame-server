export class CreateSubmissionDto {
    challengeId: number; // 푼 문제 번호
    inputFlag: string;   // 사용자가 입력한 정답 (DH{...})

    // 원래는 토큰에서 유저 ID를 뽑아야 하지만, 
    // 지금은 로그인 기능이 없으니 테스트용으로 유저 ID도 같이 받겠습니다.
    userId: number;
}