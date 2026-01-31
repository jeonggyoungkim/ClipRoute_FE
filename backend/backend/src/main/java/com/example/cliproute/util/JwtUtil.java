package com.example.cliproute.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtUtil {
    private final String secretKey = "your-very-secret-key-make-it-very-long-and-secure"; // 최소 32자 이상
    private Key key;
    private final long TOKEN_TIME = 60 * 60 * 1000L; // 1시간

    @PostConstruct
    public void init() {
        byte[] bytes = Base64.getDecoder().decode(Base64.getEncoder().encodeToString(secretKey.getBytes()));
        key = Keys.hmacShaKeyFor(bytes);
    }

    // 토큰 생성
    public String createToken(String email) {
        Date date = new Date();

        return Jwts.builder()
                .setSubject(email) // 사용자 식별값
                .setExpiration(new Date(date.getTime() + TOKEN_TIME)) // 만료 시간
                .setIssuedAt(date) // 발급일
                .signWith(key, SignatureAlgorithm.HS256) // 암호화 알고리즘
                .compact();
    }
}